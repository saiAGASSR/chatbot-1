'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


import { SuggestionButtons } from './SuggestionButtons';
import { responseObject } from './responseObject';
import ChatHeader from './ChatHeader';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import Avatar from '@mui/material/Avatar';
import bot_movie_results from './carouselsData';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { SpeechPopUp } from './SpeechPopUp';
import { carousel_results } from '../../../genericFunctions/testCarousels';
import { ParticlesBackground } from './ParticlesBackground';
import movieSuggestions from '../../../genericFunctions/suggestions';



export default function ChatbotUI({voiceInput , jwt , isTest}) {
  const [userId,setUserId] = useState(15)
  const [userName,setUserName] = useState('Master');
  const [sessionId, setSessionId] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [clearChat,setClearChat]= useState(false);
  const [messages, setMessages] = useState([]);

  


  const messagesLength = messages.length;
  

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const userInputFocus = useRef(null)
  const response = responseObject;

  const fetchBotResponse = async (userInput , initialUrl = false , type) => 
    {
          let body;
          console.log("session id in fetchBotResponse initialUrl",sessionId);
          

          if(initialUrl){
            body = {
              userid: `${userId}`,
              session_id: sessionId,
              type : 'initialRequest'
            };
            console.log("body if initial url ",body)
          } else{
            body = {
              userid: `${userId}`,
              session_id: sessionId,
              user_message: userInput
            };
            console.log("body if not initial url ",body)
          }
          const url = initialUrl ? `https://alphaapi.myreco.in/chatbot/v1/generate-suggestions` : `https://alphaapi.myreco.in/chatbot/v1/chat?source=${type}`
          // const url = initialUrl ? 'http://192.168.141.143:8000/generate_suggestions' : 'http://192.168.141.143:8000/chat'
        
          try {
              const response = await axios.post(
                url,
                body,
                {
                  headers : {
                    'Authorization' : `Bearer ${jwt}`,
                    'X-MYRECO-Project-ID' : projectId,
                    'X-MYRECO-API-Key' : apiKey
                  },
                  // withCredentials: true,
                }
              );
            
              if(response.data.status_code == 429) {
                return {
                  message: response.data.message,
                  results : [],
                  Search_Suggestions:[],
                }
              }

              console.log("response",response.data);
              console.log("response",response.data.length);
              

              if(Object.keys(response.data).length === 0){
                return {
                  message: "Empty Response from Bot",
                  results:[],
                  Search_Suggestions : []
                }
              }

            return response.data;  // Return the parsed JSON response
          } catch (error) {
            console.error("Error in chat request:", error);
            if(error.code === 'ECONNABORTED'){
              console.error("Timeout error:", error.message);
            }
            if(error.code === 'tokenExpired'){
              console.error("token expired", error.message);
            }

            return {
              message : "Sorry, something went wrong.",
              results : [],
              Search_Suggestions: [],
            };
          }
    };
  
  const handleSimilarContent = async (contentId)=>
    {
      setIsTyping(true)
      const url = `https://alphaapi.myreco.in/chatbot/v1/similar-content/${contentId}?user_id=${userId}`
      const config = {
              headers : {
                'Authorization' : `Bearer ${jwt}`,
                'X-MYRECO-Project-ID' : projectId,
                'X-MYRECO-API-Key' : apiKey
              },
            }

      try {
              const response = await axios.get(url,config);
              console.log("response from similar",response.data);
              const botReply = await response.data ;
              setIsTyping(false)
              setMessages((prev) => {
                  const updated = [...prev];


                  // Add the new bot message with carousel and suggestions (if any)
                  return [...updated, { from: 'bot', carousel_results: botReply.results, text: botReply.message, suggestions: [] }];
                });
      } catch(error){

      setIsTyping(false)
      // Check if we have suggestions in the previous message and remove them
      setMessages((prev) => {
        const updated = [...prev];


        // Add the new bot message with carousel and suggestions (if any)
        return [...updated, { from: 'bot', carousel_results: [], text: `error from bot `, suggestions: [] }];
      });

      }
    }
  const handleUserIdChange = (value)=>
    {
        console.log(value ,"userId changed ?");
        const afterTrim = value.trim();
        console.log(afterTrim);
        
        setUserId(afterTrim)
    }
  
  const sendMessage = useCallback( async (messageText , fancy = null  , type = "text") => {
    console.log("checking sendMessage Cache using useMemo - messageText value is ",messageText);

    let newMessage;

    if(fancy){
      newMessage = {from :'user', text : fancy }
    } else{

      newMessage = { from: 'user', text: messageText };

    }
    setMessages((prev) => [...prev, newMessage]);

    // Set bot typing animation
    setIsTyping(true);

    // Fetch bot reply (assuming this fetches the bot response)
    const botReply = await fetchBotResponse(messageText , false , type);
    console.log("response from bot",botReply);
    console.log("type of response from bot",typeof response);

    setIsTyping(false);

    // Check if we have suggestions in the previous message and remove them
    setMessages((prev) => {
      const updated = [...prev];


      // Add the new bot message with carousel and suggestions (if any)
      return [...updated, { from: 'bot', carousel_results: botReply.results, text: botReply.message, suggestions: botReply.Search_Suggestions }];
    });

  },[sessionId, userId, jwt, projectId, apiKey])

useEffect(() => {
      setMessages((prevMessages)=>{
        const restart = [...prevMessages];
        restart.splice(1,restart.length)

        return restart;
      })
      setClearChat(false)
  }, [clearChat]);


  useEffect(() => {
    console.log("Hiiiiiiiii");
    
    const defineIds = () => {
      console.log("Setting project id apikey etc");
      
      const existingSessionId = sessionStorage.getItem('sessionId');
      console.log('existingSessionId: ', existingSessionId);
      const storedUserId = localStorage.getItem('userId') || '';
      console.log('storedUserId: ', storedUserId);
      const storedApiKey = localStorage.getItem('apiKey') || '';
      console.log('storedApiKey: ', storedApiKey);
      const storedProjectId = localStorage.getItem('projectId') || '';
      console.log('storedProjectId: ', storedProjectId);

      setUserId(storedUserId);
      setApiKey(storedApiKey);
      setProjectId(storedProjectId);

      if (!existingSessionId) {
        const newSessionId = uuidv4();
        sessionStorage.setItem('sessionId', newSessionId);
        setSessionId(newSessionId);
      } else {
        setSessionId(existingSessionId);
      }
    };

    defineIds();
  }, [])

  

  useEffect(() => {
    const fetchInitialBotMessage = async () => {
          if (!sessionId || !userId) return;
      const botReply = await fetchBotResponse(`My user id is ${userId}` , true);
      console.log('initialBotReply',botReply);

      

      setMessages([
          { from: 'bot',
            text: (
            <>
              <div>
                <div className='flex row'>
                  
                
                <span className="font-bold text-base">
                  {botReply.userName ? `Hello ${botReply.userName}` : `Hello Master`}
                </span>
                {/* <span className='ml-2'>&#129502;</span> */}
                </div>
                <span className="text-sm text-white ">
                  I can help you find movies, TV series, and live channels based on your preferences or searches.
                </span>
              </div>
            </>
          ),
          // suggestions: movieSuggestions,
          // searchSuggestionsResponse : 'Based on Streaming, here are personalized live channels curated for you',
          // carousel_results : carousel_results
          
        },
        {
          from: 'bot',
          carousel_results: botReply.results,
          text: botReply.message,
          suggestions: botReply.suggestions,
          searchSuggestionsResponse : botReply.suggestionMessage 
        }
      ]);
    };    
    fetchInitialBotMessage();
  }, [sessionId,userId]);

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  }, [messages, isTyping]);

  return (
    <>
    {  console.log('sessionId everytime component is rendered initial url',sessionId)}
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileTap={{ scale: 2 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.5 }}
            onClick={() => setIsOpen(true)}
            className="fixed  bottom-4 right-4 bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-3 rounded-full shadow-xl hover:from-blue-700 hover:to-indigo-700 z-50 "
          >
            💬
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative lg:fixed  lg:right-0 lg:w-[30%] lg:h-[90%]   w-full h-full   rounded-xl shadow-lg flex flex-col"
            >
            
            
            {/* Header */}
            <ChatHeader setIsOpen={setIsOpen} setClearChat={setClearChat}  isTest={isTest} handleUserIdChange={handleUserIdChange} />


            {/* Messages */}
            <MessageList
              messages={messages}
              isTyping={isTyping}
              messagesEndRef={messagesEndRef}
              sendMessage={sendMessage}
              messagesLength={messagesLength}
              handleSimilarContent={handleSimilarContent}
              projectId={projectId}
            />

            {/* Input */}
            <ChatInput
              sendMessage={sendMessage}
              isTyping={isTyping}
              userInputFocus={userInputFocus}
              voiceInput={voiceInput}
              jwt={jwt}
            />



            {/* {showSpeechPopUp && <SpeechPopUp /> } */}
            {/* {true && <SpeechPopUp /> } */}

            </motion.div>


        )}
      </AnimatePresence>
    </>
  );
}
