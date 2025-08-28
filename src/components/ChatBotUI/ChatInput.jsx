'use client';
import { SendHorizonal, Mic } from 'lucide-react';
import { useRef, useState, useEffect, memo } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FcGoogle } from "react-icons/fc";
import { FaGoogle } from "react-icons/fa"; 
import SelectLabels from './DropDownLanguages';
import * as React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import SpeechPopUp  from './SpeechPopUp';
import { motion, AnimatePresence } from 'framer-motion';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import EmojiPicker from 'emoji-picker-react';
import { useMemo } from 'react';
import axios from 'axios';
import { useCallback } from 'react';
import Alert from '@mui/material/Alert';



const ChatInput = memo(function ChatInput({sendMessage, isTyping, userInputFocus,voiceInput , jwt  }) {
  const [selectedLanguageCode, setSelectedLanguageCode] = useState('en-IN');
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const bufferRef = useRef(null)
  const renderedCount = useRef(0); 
  const [input, setInput] = useState('');
  const [showVoices,setShowVoices] = useState(voiceInput === 'on');
  const [apiKey,setApikey] = useState(null);
  const [projectId,setProjectId] = useState(null);
  const [exceedLimitAlert,setExceedLimitAlert] = useState(false);
  const [exceedLimitAlertMessage,setExceedLimitAlertMessage] = useState('');
  useEffect(()=>{
    renderedCount.current += 1;  
    console.log("it is ChatInput rendered");
    console.log("ChatInput renderedCount",renderedCount.current);
  })
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && input.trim() && !(input.trim().length > 50)) {
      e.preventDefault();
      setInput('')
      sendMessage(input , false , "textMessage");
    }

  };
const handleSwicthChange=()=>{
    setShowVoices(!showVoices)
}


  useEffect(() => {
  return () => {
   // Cleanup on component unmount
   try {
       if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
         mediaRecorderRef.current.stop();
       }
     } 
    catch {
      console.log(err);
      
    }
   // Always stop tracks if we had a stream
   streamRef.current?.getTracks()?.forEach(t => t.stop());
  // Close context if open
  audioContextRef.current && audioContextRef.current.state !== 'closed' && audioContextRef.current.close();
  };
}, []);


  const handleReactMicClick = useCallback(()=>{
    if (!browserSupportsSpeechRecognition) {
      alert('Browser does not support speech recognition.');
      return;
    }
    console.log(listening,"Listening value in handleReactMicClick outside if case");


    if (listening) {
      // Stop listening manually
      console.log(listening,"Listening value in handleReactMicClick  inside If condition");

      SpeechRecognition.stopListening();

      // Auto send once listening is stopped (optional — handled below by 'listening' change)
    } else {
      console.log(listening,"Listening value in handleReactMicClick inside else case");
      resetTranscript();
      setInput(''); // Clear input when starting new speech
      SpeechRecognition.startListening({ continuous: false, language: selectedLanguageCode });
    }
},[listening ,selectedLanguageCode , resetTranscript])

useEffect(() => {
  console.log(listening,"Listening value in useEffect before trim");
  console.log(listening,"Listening value changed and this is the present value");

 if (!listening && transcript.trim()) {
  console.log(listening,"Listening value in useEffect after trim");
  
  setTimeout(() => {
    console.log(listening,"Listening value in useEffect after trim inside setTimeout");

    sendMessage(transcript , false , "reactVoice");  
    resetTranscript();
  }, 500);
}

}, [listening]);

useEffect(()=>{
  const  storedapiKey = localStorage.getItem('apiKey');
  console.log("storedapiKey in chatInput",storedapiKey);

  
  const  storedprojectId = localStorage.getItem('projectId');
  console.log("storedprojectId in chatInput",storedprojectId);
  
  setApikey(storedapiKey);
  setProjectId(storedprojectId)
},[])



const startRecording = async () => {
  try {
    // 1. Request audio with desired sample rate
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    const audioContext = new (window.AudioContext)();

    // 2. Initialize MediaRecorder with Opus codec and WebM container
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus"
    });

    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];
    audioContextRef.current = audioContext;
    streamRef.current = stream;

    // 3. Silence Detection using AudioContext and AnalyserNode
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);

    let silenceStart = null;
    const SILENCE_THRESHOLD = 0.01; // Adjust based on your environment
    const SILENCE_DURATION = 2000; // 2 seconds (was 3 sec, adjust if needed)

    const checkSilence = () => {
      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const sample = (dataArray[i] - 128) / 128;
        sum += sample * sample;
      }
      const volume = Math.sqrt(sum / dataArray.length);

      if (volume < SILENCE_THRESHOLD) {
        if (silenceStart === null) silenceStart = Date.now();
        else if (Date.now() - silenceStart > SILENCE_DURATION) {
          console.log("Google Silence detected, stopping...");
          stopRecording();
        }
      } else {
        silenceStart = null;
      }

      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        requestAnimationFrame(checkSilence);
      }
    };
    requestAnimationFrame(checkSilence);

    // 4. Recorder Events
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      bufferRef.current = await blob.arrayBuffer();

      // 5. Safe Base64 conversion for large data (consider streaming or URI for very long audio)
      const audioBase64 = arrayBufferToBase64(bufferRef.current);

      // 6. Google API endpoint and payload
      const url = `https://speech.googleapis.com/v1/speech:recognize?key=`;
      const url2 = 'https://alphaapi.myreco.in/chatbot/v1/speech-to-text';

      const googleClientdata = {
        config: {
          encoding: "WEBM_OPUS",
          languageCode: selectedLanguageCode
        },
        audio: {
          content: audioBase64
        }
      };

      const backendBody = {
        audio_text: audioBase64,
        language_code: selectedLanguageCode
      };

      const backendHeadersConfig = {
        
          headers: {
            "Content-Type": "application/json",
            "X-MYRECO-Project-ID" : projectId,
            "X-MYRECO-API-Key" : apiKey
        
        }
      }

      console.log("headers to backend", backendHeadersConfig);
      

      try {
        const response = await axios.post(url2, backendBody,backendHeadersConfig);

        console.log("response.data", response.data);

        const result = response.data;
        const transcription =
          result.results?.map((r) => r.alternatives[0].transcript).join("\n") || "";

        if (transcription.trim()) {
          setInput('');
          sendMessage(transcription ,false , "googleVoice");
        } else {
          alert("Google No speech detected.");
        }
      } catch (err) {
        console.error("Google STT API Error:", err);
      }
    };

    // 7. Start recording
    mediaRecorder.start();
    setRecording(true);
    console.log("Recording started...");
  } catch (err) {
    setRecording(false);
    console.error("Google Mic error:", err);
    alert("Google Microphone access failed.");
  }
};


function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}



const stopRecording = () => {
  if (!mediaRecorderRef.current) return; // ✅ safety check
  console.log("Stopping recording...");
  if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
    mediaRecorderRef.current.stop();
  }
  if (streamRef.current) {
    streamRef.current.getTracks().forEach((t) => t.stop());
  }
  if (audioContextRef.current) {
    audioContextRef.current.close();
  }
  setRecording(false);
};

const handleGoogleMicClick = useCallback(() => {
  if (recording) {
    stopRecording();
  } else {
    startRecording();
  }
},[recording ,selectedLanguageCode ,apiKey , projectId ])

 const inputReactTimerRef = useRef(null);
  const inputGoogleTimerRef = useRef(null);
  const alertTimerRef = useRef(null);

  // ✅ Input character limit
  useEffect(() => {
    if (input.trim().length > 50) {
      setExceedLimitAlertMessage("Maximum allowed input limit is 50 characters");
      setExceedLimitAlert(true);
    } else {
      setExceedLimitAlert(false);
    }
  }, [input]);

  // ✅ React voice limit
  useEffect(() => {
    if (listening) {
      inputReactTimerRef.current = setTimeout(() => {
        setExceedLimitAlertMessage("Maximum allowed current voice limit is 10 sec");
        setExceedLimitAlert(true);
        SpeechRecognition.stopListening();
      }, 10000); // 15 sec
    }
    return () => clearTimeout(inputReactTimerRef.current);
  }, [listening]);

  // ✅ Google voice limit
  useEffect(() => {
    if (recording) {
      inputGoogleTimerRef.current = setTimeout(() => {
        setExceedLimitAlertMessage("Maximum allowed current voice limit is 10 sec");
        setExceedLimitAlert(true);
        stopRecording();
      }, 10000); // 15 sec
    }
    return () => clearTimeout(inputGoogleTimerRef.current);
  }, [recording]);

  // ✅ Hide alert after 5 sec (with cleanup)
  useEffect(() => {
    if (exceedLimitAlert) {
      alertTimerRef.current = setTimeout(() => {
        setExceedLimitAlert(false);
      }, 5000);
    }
    return () => clearTimeout(alertTimerRef.current);
  }, [exceedLimitAlert])




// useEffect(() => {
//   if (!isTyping) userInputFocus.current.focus();
// }, [isTyping]);


 return (
    <AnimatePresence >
      <motion.div 
            className=" w-full  rounded-xl px-2 flex flex-col items-center  ">
              {console.log("it is ChatInput rendered")}
              {console.log("input value in rendered chatInput",input)}
              {console.log(" ChatInput renderedCount",renderedCount.current)} 

          <div  className='w-full rounded-2xl bg-amber-50 flex flex-col font-sans font-semibold bg-gradient-to-br from-white via-blue-50 to-blue-100 '>
                
              {exceedLimitAlert && 
              <div>
                      <Alert severity="warning">{exceedLimitAlertMessage}</Alert>
              </div>
              }
              {/* {Text area div 1} */}
              <div className='w-full rounded-2xl flex-1'>


                      {/* Input Text Area */}
                        <motion.textarea
                          whileTap={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                          whileHover={{ scale: 1.01 }}
                          rows={1}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder={isTyping ? 'Bot is typing...' : 'Type your message here to get started'}
                          className="w-full resize-none  text-black  px-3 py-2 text-sm text-black placeholder-gray-400 focus:outline-none  fo disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isTyping || listening || recording}
                          ref={userInputFocus}
                        />


              </div>


            {/* {second div 2} */}

            <div className=' flex  w-full mb-3 '>

                <div className='flex w-[93%]' >
                    <div>

                      <Tooltip title={showVoices?'Hide Voice Options' : 'Show Voice Options'} >
                        <Switch
                            checked={showVoices}
                            sx={{
                                  ".MuiSwitch-thumb": {
                                    backgroundColor: "#FF9528"
                                  },
                                  ".MuiSwitch-track": {
                                    backgroundColor: "#FF4823"
                                  },
                                  "&.Mui-checked": {
                                    ".MuiSwitch-thumb": {
                                      backgroundColor: "#FF4823"
                                    },
                                    ".MuiSwitch-track": {
                                      backgroundColor: "#FF4823"}}}}
                            onChange={handleSwicthChange}
                          />
                    </Tooltip>

                    </div>
                    


                            {showVoices && 
                      
                      <div className='flex-1 flex items-center ml-10 '>

                            {/* React Speech Recognition Mic Button */}
                            <div  className = "w-[10%]">
                                <motion.button
                                  whileTap={{ scale: 3 }}
                                  transition={{ duration: 0.2 }}
                                  whileHover={{ scale: 1.5 }}
                                  onClick={handleReactMicClick}
                                  aria-label="Start mic input using React Speech Recognition"
                                  className="text-gray-500 hover:text-blue-600"
                                  disabled={ recording || isTyping}
                                >
                                  {listening ? (
                                    <Mic className="w-5 animate-pulse" color="red" />
                                  ) : (
                                    <Mic className="w-5" />
                                  )}
                                </motion.button>

                            </div>

                      {/* Google Cloud Speech-to-Text Mic Button */}
                      <div>
                          <motion.button
                            whileTap={{ scale: 3 }}
                            transition={{ duration: 0.2 , behaviour:'smooth' }}
                            whileHover={{ scale: 1.5 }}
                            onClick={handleGoogleMicClick}
                            type="button"
                            aria-label="Start mic input using Google Speech-to-Text"
                            className="text-gray-500 hover:text-blue-600"
                            disabled={listening || isTyping}
                          >
                            {recording ? (
                              <FcGoogle className="w-5 animate-pulse" />
                            ) : (
                              <FaGoogle className="w-5" />
                            )}
                          </motion.button>

                      </div>

                      <div className='ml-2'>
                        
                          {/* Language Selector */}
                          <SelectLabels  
                            setSelectedLanguageCode={setSelectedLanguageCode}
                            selectedLanguageCode={selectedLanguageCode}
                          />

                      </div>










                      </div> }

                    

                </div>


              

             <div className='flex-1   flex  justify-center  '>

                     {/* <div>
                       <EmojiPicker 
                       className='bg-transparent'
                       style={{backgroundColor: 'transparent'}}
                       onEmojiClick={(e)=>{
                        console.log("input with emoji", input )
                        console.log("input with emoji", input + e.emoji)
                        setInput(prev=>{
                          return prev + e.emoji
                        })                        
                       }} />
                     </div> */}
              
                {/* Send Button */}
                <div className='flex mr-4 '>
                                   <motion.button
                    whileTap={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={()=>{
                      console.log("send button is clicked");
                      
                      setInput('');
                      sendMessage(input , false , 'textMessage');
                    }
                    }
                    disabled={!input.trim() || isTyping || (input.trim().length > 50)}
                    aria-label="Send message"
                    className={` rounded-full  transition ${
                      !input.trim() || isTyping
                        ? 'bg-red-700 text-white cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    <SendHorizonal color='white' className=" w-10 h-6 animate-pulse " />
                  </motion.button>

                </div>


             </div>

           </div>


          </div>

          {(listening || recording )  && <SpeechPopUp handleReactMicClick={handleReactMicClick} handleGoogleMicClick={handleGoogleMicClick}  listening={listening} recording={recording}/> }
          
    </motion.div>
  </AnimatePresence>


);
})

export default ChatInput;
