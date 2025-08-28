import { X } from 'lucide-react'; // for modern close icon
import Avatar from '@mui/material/Avatar';
import ReplayIcon from '@mui/icons-material/Replay';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { memo, useEffect, useRef, useState } from 'react';
import ChatBotHelp from './ChatBotHelp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { SpeechPopUp } from './SpeechPopUp';
import ChangeUserIdForm from './ChangeUserIdForm';
import { Button } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';



const ChatHeader = memo(function ChatHeader ({setIsOpen , setClearChat , isTest , handleUserIdChange }) {
    const [showModal, setShowModal] = useState(false);
    const deviceId = localStorage.getItem('deviceId')
    const userId = localStorage.getItem('userId')
    console.log("deviceId from the localStorage",deviceId);
    console.log("deviceId from the localStorage",userId);
    console.log("deviceId from the localStorage Type",typeof deviceId);
    const isAndroid = ['11', '7', '6', '105'].includes(deviceId);
    const renderedCount = useRef(null);
    const [showChangeUserIdForm , setShowChangeUserIdForm] = useState(false)

    useEffect(()=>{
        renderedCount.current += 1;  
        console.log("it is ChatHeader rendered in UseEffect");
        console.log("renderedCountin UseEffect ",renderedCount.current);
    })

    return (
        <div className="rounded-sm text-black p-4 flex justify-between items-center h-[11.5%]   bg-gradient-to-br from-white via-blue-50 to-blue-100">
           {console.log("Chat header is rendered  ")} 
           {console.log("renderedCount of chatHeader ",renderedCount.current)} 
            <div className='flex flex-row'>
                <Avatar
                    alt='bot'
                    src='https://i.ibb.co/8LT53RnN/myreco-Icon.png'
                    sx={{ width: 45, height: 40 }}
                /> 
                <div className="flex flex-col">

                    <span className="ml-2 text-2xl  md:text-xl font-semibold leading-tight ">
                        RecoBot
                    </span>

                    <span className="ml-2 text-sm  md:text-sm font leading-tight ">
                    myreco AI Assistant
                    </span>

                </div>

            </div>

            {isTest && 
                <div>
                      <Button  onClick={()=>setShowChangeUserIdForm(true)} color="error"> Change User Id</Button>
                </div> 
            }

            { showChangeUserIdForm && < ChangeUserIdForm  handleUserIdChange={handleUserIdChange} setShowUserIdForm={setShowChangeUserIdForm}/> }
            

            <div className='flex items-center'>
                {/* <div className="relative group mr-5">

                    <h3 className="text-lg text--600 font-medium font-sans color-blue">{userId}</h3>

                </div> */}



                    <Tooltip title="Help">

                        <div >

                            <button
                                className="text-black hover:text-blue-600 transition mr-2"
                                onClick={() => setShowModal(true)}
                            >

                                    <FontAwesomeIcon icon={faCircleInfo} beat className="text-black-600 text-sm" />

                            </button>



                        </div>

                    </Tooltip>  

                    <Tooltip title="Reload">

                        <div >
                            <button
                                className="text-black hover:text-red-600 transition mr-2"
                                onClick={() => setClearChat(true)}
                            >
                                <ReplayIcon color="error" />
                            </button>
                        </div>

                    </Tooltip>

                    <Tooltip title="Close Chat">

                    {isAndroid ?  
                        <div className=" mt-1">
                            <button
                                onClick={() => {
                                window.location.href = "https://moviesandtv.myvi.in/appclose?redirectionURL=back";
                                }}
                                className="text-white hover:text-gray-200 transition"
                                title="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>

                        </div>

                    :   
                        <div className="mt-2">

                            <button onClick={() => setIsOpen(false)} className="text-red-500 hover:text-red-750" title='Close'>
                            <X className="w-5 h-5" />

                            </button>
                        </div>
                    }

                    </Tooltip>  

                    <Tooltip title="Version Number">
                
                        <div className='ml-2'>

                            <p className="text-xs text-gray-500 font-mono">v1.5</p>

                        </div>
                    </Tooltip>



            </div>

             {/* Modal */}
            {showModal &&  <ChatBotHelp setShowModal={setShowModal} />}



        </div>
        

    );
})

export default ChatHeader;
