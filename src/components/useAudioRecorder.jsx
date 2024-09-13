import { useState, useCallback, useRef } from "react";
// import { getLine } from "./redux/technical/technical-selectors";

const useAudioRecorder = ({ dataCb }) => {
  // const line = useSelector(getLine);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorderMic, setMediaRecorderMic] = useState();
  const [mediaRecorderSpeaker, setMediaRecorderSpeaker] = useState();
  const [timerInterval, setTimerInterval] = useState();
  const sourceNodeMic = useRef();
  const sourceNodeSpeaker = useRef();
  const scriptProcessorMic = useRef();
  const scriptProcessorSpeaker = useRef();
  const audioContext = useRef(new AudioContext());

  const _startTimer = useCallback(() => {
    const interval = setInterval(() => {
      setRecordingTime((time) => time + 1);
    }, 1000);
    setTimerInterval(interval);
  }, [setRecordingTime, setTimerInterval]);

  const _stopTimer = useCallback(() => {
    timerInterval != null && clearInterval(timerInterval);
    setTimerInterval(undefined);
  }, [timerInterval, setTimerInterval]);

  const float32To16BitPCM = (float32Arr) => {
    const pcm16bit = new Int16Array(float32Arr.length);
    for (let i = 0; i < float32Arr.length; ++i) {
      // force number in [-1,1]
      const s = Math.max(-1, Math.min(1, float32Arr[i]));

      /**
       * convert 32 bit float to 16 bit int pcm audio
       * 0x8000 = minimum int16 value, 0x7fff = maximum int16 value
       */
      pcm16bit[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return pcm16bit;
  };

  const startRecording = async () => {
    if (timerInterval != null) throw new Error("timerInterval not null");
    const isTesting = !navigator.mediaDevices;
    if (isTesting) {
      setIsRecording(true);
      return 24000;
    }

    console.log("Стартуємо запис");
    const streamSpeaker = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    const streamMic = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    audioContext.current.resume();
    sourceNodeMic.current =
      audioContext.current.createMediaStreamSource(streamMic);
    sourceNodeSpeaker.current =
      audioContext.current.createMediaStreamSource(streamSpeaker);

    const chunkSize = 4096;
    scriptProcessorMic.current = audioContext.current.createScriptProcessor(
      chunkSize,
      1,
      1
    );

    scriptProcessorSpeaker.current = audioContext.current.createScriptProcessor(
      chunkSize,
      1,
      1
    );

    scriptProcessorMic.current.onaudioprocess = (event) => {
      const inputBuffer = event.inputBuffer;
      const float32Audio = inputBuffer.getChannelData(0);
      const pcm16Audio = float32To16BitPCM(float32Audio);
      if (dataCb) {
        dataCb(pcm16Audio, audioContext.current.sampleRate, "mic");
      }
    };

    scriptProcessorSpeaker.current.onaudioprocess = (event) => {
      const inputBuffer = event.inputBuffer;
      const float32Audio = inputBuffer.getChannelData(0);
      const pcm16Audio = float32To16BitPCM(float32Audio);
      if (dataCb) {
        dataCb(pcm16Audio, audioContext.current.sampleRate, "speaker");
      }
    };

    sourceNodeMic.current.connect(scriptProcessorMic.current);
    sourceNodeSpeaker.current.connect(scriptProcessorSpeaker.current);

    scriptProcessorMic.current.connect(audioContext.current.destination);
    scriptProcessorSpeaker.current.connect(audioContext.current.destination);

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
    scriptProcessorMic.current?.disconnect();
    scriptProcessorSpeaker.current?.disconnect();
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
      sourceNodeMic.current.connect(scriptProcessorMic.current);
      sourceNodeSpeaker.current.connect(scriptProcessorSpeaker.current);
      scriptProcessorMic.current.connect(audioContext.current.destination);
      scriptProcessorSpeaker.current.connect(audioContext.current.destination);
    } else {
      setIsPaused(true);
      _stopTimer();
      mediaRecorderMic?.pause();
      mediaRecorderSpeaker?.pause();

      // Відключення обробки аудіо під час паузи
      scriptProcessorMic.current.disconnect();
      scriptProcessorSpeaker.current.disconnect();
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
