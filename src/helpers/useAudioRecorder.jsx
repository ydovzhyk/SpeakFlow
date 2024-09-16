import { useState, useCallback, useRef } from "react";

const useAudioRecorder = ({ dataCb }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorderMic, setMediaRecorderMic] = useState();
  const [mediaRecorderSpeaker, setMediaRecorderSpeaker] = useState();
  const [timerInterval, setTimerInterval] = useState();
  const sourceNodeMic = useRef();
  const sourceNodeSpeaker = useRef();
  const audioWorkletNode = useRef();
  const audioContext = useRef(new AudioContext());

  const _startTimer = useCallback(() => {
    const interval = setInterval(() => {
      setRecordingTime((time) => time + 1);
    }, 2000);
    setTimerInterval(interval);
  }, [setRecordingTime, setTimerInterval]);

  const _stopTimer = useCallback(() => {
    timerInterval != null && clearInterval(timerInterval);
    setTimerInterval(undefined);
  }, [timerInterval, setTimerInterval]);

  const startRecording = async () => {
    if (timerInterval != null) throw new Error("timerInterval not null");
    const isTesting = !navigator.mediaDevices;
    if (isTesting) {
      setIsRecording(true);
      return 24000;
    }

    audioContext.current.onerror = (event) => {
      console.log("AudioContext error:", event.error);
    };

    if (audioContext.current.state === "suspended") {
      await audioContext.current.resume();
    }

    const streamSpeaker = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    const streamMic = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    sourceNodeMic.current =
      audioContext.current.createMediaStreamSource(streamMic);
    sourceNodeSpeaker.current =
      audioContext.current.createMediaStreamSource(streamSpeaker);

    await audioContext.current.audioWorklet.addModule(
      new URL("./audio-worklet-processor.js", import.meta.url).href
    );
    audioWorkletNode.current = new AudioWorkletNode(
      audioContext.current,
      "audio-worklet-processor"
    );

    let lastMicLevel = 0;
    let lastSpeakerLevel = 0;
    let currentMainChannel = "speaker";

    audioWorkletNode.current.port.onmessage = (event) => {
      const { level, pcm16Audio, channel } = event.data;
      if (channel === "mic") {
        lastMicLevel = level;
      } else if (channel === "speaker") {
        lastSpeakerLevel = level;
      }

      if (lastMicLevel > lastSpeakerLevel && currentMainChannel !== "mic") {
        currentMainChannel = "mic";
        dataCb(pcm16Audio, audioContext.current.sampleRate, "mic");
      } else if (
        lastSpeakerLevel > lastMicLevel &&
        currentMainChannel !== "speaker"
      ) {
        currentMainChannel = "speaker";
        dataCb(pcm16Audio, audioContext.current.sampleRate, "speaker");
      }
    };

    sourceNodeMic.current.connect(audioWorkletNode.current);
    sourceNodeSpeaker.current.connect(audioWorkletNode.current);

    audioWorkletNode.current.connect(audioContext.current.destination);

    setIsRecording(true);
    const recorderMic = new MediaRecorder(streamMic);
    const recorderSpeaker = new MediaRecorder(streamSpeaker);
    setMediaRecorderMic(recorderMic);
    setMediaRecorderSpeaker(recorderSpeaker);
    recorderMic.start();
    recorderSpeaker.start();
    _startTimer();

    return audioContext.current.sampleRate;
  };

  const stopRecording = async () => {
    audioWorkletNode.current?.disconnect();
    sourceNodeMic.current?.disconnect();
    sourceNodeSpeaker.current?.disconnect();
    mediaRecorderMic?.stop();
    mediaRecorderSpeaker?.stop();
    _stopTimer();
    setRecordingTime(0);
    setIsRecording(false);
    setIsPaused(false);
  };

  const togglePauseResume = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      mediaRecorderMic?.resume();
      mediaRecorderSpeaker?.resume();
      _startTimer();

      // Відновлення обробки аудіо
      sourceNodeMic.current.connect(audioWorkletNode.current);
      sourceNodeSpeaker.current.connect(audioWorkletNode.current);
      audioWorkletNode.current.connect(audioContext.current.destination);
    } else {
      setIsPaused(true);
      _stopTimer();
      mediaRecorderMic?.pause();
      mediaRecorderSpeaker?.pause();

      // Відключення обробки аудіо під час паузи
      audioWorkletNode.current.disconnect();
      sourceNodeMic.current.disconnect();
      sourceNodeSpeaker.current.disconnect();
    }
  }, [
    mediaRecorderMic,
    mediaRecorderSpeaker,
    isPaused,
    setIsPaused,
    _startTimer,
    _stopTimer,
  ]);

  return {
    startRecording,
    stopRecording,
    togglePauseResume,
    isRecording,
    isPaused,
    audioContext: audioContext.current,
    sourceNodeMic: sourceNodeMic.current,
    sourceNodeSpeaker: sourceNodeSpeaker.current,
    recordingTime,
  };
};

export default useAudioRecorder;
