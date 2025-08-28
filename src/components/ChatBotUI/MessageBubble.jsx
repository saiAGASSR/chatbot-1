// components/MessageBubble.jsx
import Avatar from '@mui/material/Avatar';
import SplitText from "./SplitText";
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';



export const MessageBubble = ({ from, text , lastMessage , index }) => {
  const handleAnimationComplete = () => {
  console.log('All letters have animated! lastMessage messagebox');
};
  return (

          
    <div className={`flex  ${index == 0 ? '' : 'mt-5'} ${from === 'user' ? 'justify-end' : 'justify-start'} break-normal whitespace-normal items-center`}>
      {lastMessage && console.log("last message ? messagebox",lastMessage)}
      {from && console.log("from ? messagebox",from)}
      {text && console.log("text  ?messagebox " ,text)}

    { from !== 'user' && 
      
      <Avatar
        src="/gifs/chatbotavatar.png"
        alt='bot'
        // src='https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?w=740'
        // src='https://sdmntprwestus.oaiusercontent.com/files/00000000-2b74-6230-ad6c-73fc65335d32/raw?se=2025-04-11T09%3A35%3A24Z&sp=r&sv=2024-08-04&sr=b&scid=59bf0b2b-06d8-5f0d-83d9-6e6f3b80ec19&skoid=e872f19f-7b7f-4feb-9998-20052dec61d6&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-11T08%3A50%3A35Z&ske=2025-04-12T08%3A50%3A35Z&sks=b&skv=2024-08-04&sig=gtMvDTQ5Fa2DK4Q7z1/RbdnVLvuGHIHc24iP7O72wvc%3D'
        // src='https://i.ibb.co/sdZcFf3z/Chat-GPT-Image-Apr-11-2025-04-36-26-PM.png'
        // src='https://i.imgur.com/7hb9DSP.png'
        // src='https://i.imgur.com/AKwCiIP.jpeg'
        // className='animate-spin'
        // className='animate-ping'
        className='animate-pulse'
        
      /> 
      // <div className='w-20 h-10'>
      //       <DotLottieReact
      //         src="https://lottie.host/7a3f29a1-a94b-4558-8720-27707ec7a824/gRhI0ECzKR.lottie"
      //         loop
      //         autoplay
      //         />
      // </div>
    }

  

      <div
        className={`break-normal whitespace-normal rounded-xl px-2 py-1 max-w-[90%] text-sm text-white font-semibold font-sans shadow-2xl`}
      >
        {
          true && index !=0 && lastMessage && from === 'bot' ?
                (<SplitText
                  text={text}
                  className="break-normal whitespace-normal"
                  delay={30}
                  duration={0.6}
                  // ease="power3.out"
                  // splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  // rootMargin="-100px"
                  // textAlign="center"
                  onLetterAnimationComplete={handleAnimationComplete}
      />) :
           ( <span className='break-normal whitespace-normal'>{text}</span>)
        }
      </div>

      { from === 'user' && 
      
      // <Avatar
      //   alt='you'
      //   src='https://i.imgur.com/ayWNFic.pnG'
      //   sx={{ width: 32, height: 32 }}
      
      // /> 
      <div className='w-13 h-13' > 
            <DotLottieReact
                  src="https://lottie.host/2d98a8d5-e39c-4f19-9d46-d316efc378b7/2vU786SDu1.lottie"
                  loop
                  autoplay
                /> 
      </div>
    }
  </div>
);
};
