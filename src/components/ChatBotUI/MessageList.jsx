// MessageList.jsx
'use client';
import { TypingDots } from './TypingDots';
import { SuggestionButtons } from './SuggestionButtons';
import CarouselComponent from './CarouselComponent';
import { MessageBubble } from './MessageBubble';
import { memo, useEffect, useRef, useState } from 'react';
import Carousel from '@/blocks/Components/Carousel/Carousel';
import BrowseFilters from './BrowseFilters';
import filtersConfig from './../../../filters.json';
import UserFeedback from './UserFeedback';

  const MessageList = memo(function MessageList ({ messages, isTyping, messagesEndRef, sendMessage ,messagesLength , handleSimilarContent, projectId}) {
  const renderedCount = useRef(null);  
  useEffect(()=>{
    renderedCount.current += 1;  
    console.log(" useEffect it is MessageList rendered");
    console.log("useEffect MessageList renderedCount",renderedCount.current);
  })
  const [filtersTitle,setFiltersTitle] = useState('Browse Movies')

  const [browseButtonsClicked , setBrowseButtonsClicked]  = useState(false);

  const  browseButtonsStyle = '	font-semibold font-sans text-sm  bg-transparent hover:bg-grey-500 text-white font-semibold hover:text-white py-1.5 px-1.5 border border-white hover:scale-[1.1] rounded-lg transition duration-700 ease-in-out'

  console.log("filtersConfig");
  console.log(filtersConfig);
  console.log(filtersConfig[projectId]);
  // console.log(filtersConfig.(moviesConfig))
  console.log('projectId: In Message List', projectId);

  let tenantSpecificConfig = filtersConfig[projectId]

  let configBySelect;

  const configKeyMap = {
    'Browse Movies': 'moviesConfig',
    'Browse TvSeries': 'tvSeriesConfig',
    'Browse Live': 'liveConfig',

  }
 
  configBySelect = tenantSpecificConfig?.[configKeyMap[filtersTitle]] || []
  console.log(configBySelect,"configBySelect")
  
  

  return (
    
    <div className="w-max overflow-y-auto flex-1 no-scrollbar px-4 py-3 space-y-2  max-w-full max-h-full">

        {messages.map((msg, index) => (
          <div key={index} className={`flex-1 flex-col  space-y-2 ${msg.from === 'user' ? 'items-end' : 'items-start'} `}>

            
            {/* Message Bubble */}
            {msg.text && <MessageBubble from={msg.from} text={msg.text} index={index} lastMessage={(messagesLength-1) === index}/>}

            {/* Carousel Response */}
            {msg.carousel_results && 
              <CarouselComponent items={msg.carousel_results} handleSimilarContent={handleSimilarContent} />
            }
            {msg.carousel_results && <UserFeedback />}
            {msg.searchSuggestionsResponse && <div><p className="text-sm font-bold text-white dark:text-white max-w-[90%]  ml-5 mt-5">{msg.searchSuggestionsResponse}</p></div> }

            {/* Suggestions */}
            {(msg.suggestions && msg.suggestions.length > 0) && <SuggestionButtons suggestions={msg.suggestions} istyping={isTyping} sendMessage={sendMessage}  />}

            {console.log((index === 1),"explore more")}
            {console.log((index),"explore more")}

            {(index === 1) &&  msg.carousel_results && <div><p className="text-sm font-bold text-white dark:text-white max-w-[90%]  ml-5 mt-3">Explore More</p></div> }


            {msg.carousel_results && (
              <div className='ml-4 flex  gap-2 mt-3 '>
                <button className={browseButtonsStyle} onClick={()=> 
                    {setFiltersTitle('Browse Movies') 
                      setBrowseButtonsClicked(true)

                    } }>
                      Browse Movies
                      </button>
                <button className={browseButtonsStyle} onClick={()=> {
                  setFiltersTitle('Browse TvSeries') 
                  setBrowseButtonsClicked(true)

                  }}>
                    Browse TVSeries
                    </button>
                <button className={browseButtonsStyle} onClick={()=>{ 
                  setFiltersTitle('Browse Live') 
                  setBrowseButtonsClicked(true)
                  } }>
                  Browse Live
                    </button>

              </div>
              
            )}
            {msg.carousel_results && browseButtonsClicked && <BrowseFilters title={filtersTitle} data={configBySelect} setBrowseButtonsClicked={setBrowseButtonsClicked} sendMessage={sendMessage} isTyping={isTyping}/>}
          </div>
        ))}

          {/* Typing Animation */}
          {isTyping && <TypingDots />}



          {/* Always scroll to the bottom */}
          <div className='h-1' ref={messagesEndRef} />
    </div>
  );
})

export default MessageList;