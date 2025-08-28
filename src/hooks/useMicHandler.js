import { useCallback } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const useMicHandler = (selectedLanguageCode, setInput) => {
  const {
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  const handleReactMicClick = useCallback(() => {
    try {
      // ✅ Check browser support first
      if (!browserSupportsSpeechRecognition) {
        alert("Browser does not support speech recognition.");
        return;
      }

      console.log(`Listening state before click: ${listening}`);

      if (listening) {
        // ✅ Stop listening
        console.log("Stopping listening...");
        SpeechRecognition.stopListening();
      } else {
        // ✅ Start listening
        console.log("Starting listening...");
        resetTranscript();
        setInput(""); // Clear input when starting new speech

        SpeechRecognition.startListening({
          continuous: false, // Prevents endless background listening
          language: selectedLanguageCode || "en-US", // Default fallback
        });
      }
    } catch (error) {
      console.error("Error in handleReactMicClick:", error);
    }
  }, [listening, browserSupportsSpeechRecognition, resetTranscript, selectedLanguageCode, setInput]);

  return { handleReactMicClick };
};

export default useMicHandler;
