import { Helmet } from "react-helmet-async";
import Home from "../../components/RecordWindow/RecordWindow";

import s from "./HomePage.module.scss";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>SpeakFlow - Audio Transcription and Translation</title>
        <meta
          name="description"
          content="SpeakFlow is an innovative app that records audio from your computer's microphone and speakers, converts it into text, and provides translation into the desired language."
        />
        <meta
          name="keywords"
          content="audio to text, audio transcription, record audio, convert audio to text, microphone recording, speaker recording, audio translation"
        />
        <link rel="canonical" href="https://asdental.org" />
        <link rel="alternate" href="https://asdental.org" hrefLang="en" />
      </Helmet>
      <h1 className={s.visuallyHidden}>Welcome to SpeakFlow!</h1>
      <Home />
    </>
  );
};

export default HomePage;
