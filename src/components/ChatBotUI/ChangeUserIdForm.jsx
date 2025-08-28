import * as React from 'react';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/joy/styles';
import Textarea from '@mui/joy/Textarea';
import { useState } from 'react';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';


const ChangeUserIdForm = ({setShowUserIdForm ,handleUserIdChange})=>{
    const [input,setInput] = useState('');

    const handleChange =(e)=>{
        setInput(e.target.value)
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(!input) return
        handleUserIdChange(input)
        setInput('');
        setShowUserIdForm(false);
    }

    





 
    return (

        <div className=" fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    {console.log("input",input)
        }

            <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 p-6 rounded-lg shadow-lg   h-64 shadow-sky-500/50 inset-shadow-sm inset-shadow-sky-500 ring-1 ring-sky-500/50">

                <form  onSubmit={handleSubmit}>


                    <Textarea 
                        placeholder="Enter New Userid" 
                        minRows={2} 
                        onChange={handleChange}
                        value = {input}
                    />

                    
                    <button className='mt-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' type='submit'> Submit </button>
                    <button className= 'ml-5 mt-10 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' onClick={()=>setShowUserIdForm(false)}> Close </button>



                </form>


                
              
            </div>

        </div>
    )

     
}

export default ChangeUserIdForm;