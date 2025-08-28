import { ReceiptRussianRuble } from "lucide-react";
import { useEffect, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { Rating } from "@material-tailwind/react";

import { Tooltip, Button } from "@material-tailwind/react";



const  UserFeedback = ()=>{
    const [showFeedBack,setShowFeedBack] = useState(false);
    const [showFeedBack1,setShowFeedBack1] = useState(true);
    const [isLiked,setIsLiked] = useState(false)
    const [isDisliked,setIsDisliked] = useState(false)
    const bgcolor = 'bg-gradient-to-br from-white via-blue-50 to-blue-100'
    const iconLikedBasisColor =  isLiked ? 'scale-140 t'  : '';
    const iconDislikedColor = isLiked ? '' : 'scale-140  text-yellow';

    


    return <div className={`${isDisliked? 'mb-7 mr-10' : ''} flex    w-[99%] ml-[2.5%]  h-10   text-white items-baseline`}>
        

        <div className={`flex  w-full } items-baseline `}>

                <div className={` w-[80%] xl:w-[60%]`}>

                    <p className="text-white text-base leading-relaxed   text-sm text-lg  lg:text-sm" >{!showFeedBack? 'Are these relevant for you ?' : `Thanks for your feedback .${isDisliked ? 'We will try to improve' : ''}`}  </p>

                </div>


                <div>
                    <Tooltip 
                        content = "Like this"
                        animate = {
                                {
                                    mount: { scale: 1, y: 0 },
                                    unmount: { scale: 0, y: 25 },
                                }
                        }
                        >
                        <button className={`mr-4 ml-2 scale-120 `} onClick={()=>{    setIsLiked(true);
                                                                                     setIsDisliked(false);
                                                                                     setShowFeedBack(true)}
                                                                            }> 
                            <AiOutlineLike className={`hover:text-yellow-400 ${isLiked ? 'text-yellow-400 scale-130':''}  transition delay-150 ease-in-out`}  /> 
                        </button>   
                    </Tooltip>
                </div>

                <Tooltip 
                    content = "Dislike this"
                    animate = {{

                                mount: { scale: 1, y: 0 },
                                unmount: { scale: 0, y: 25 },
                            }}
                    >                                                        
                    <div>
                        <button className={`mr-5 scale-120 `} onClick={()=>{   setIsDisliked(true);
                                                                                setIsLiked(false)
                                                                                setShowFeedBack(true)}
                                                                            }> 
                            <AiOutlineDislike className={`hover:text-yellow-400 ${isDisliked ? 'text-yellow-400 scale-130'  : ''}  transition delay-150 ease-in-out`} /> 
                        </button>
                    </div>    
                </Tooltip>                                                                                 


        </div>


    </div>
}

export default UserFeedback;

