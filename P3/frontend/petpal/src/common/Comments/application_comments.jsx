import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import './comments.css'



function ApplicationComments(){

    //TODO: when making the axios call, do a check to see if the user is the shelter or the applicant
    // if the user is the shelter, then while parsing the data, set is_user to true if the sender is the shelter,
    // and set is_user to false if the sender is the applicant

    const is_user = true;   
    const test_message_data= [
        {
            content:"hello shelter where is my dog",
            is_user:true,
        },
        {
            content:"hello user your dog is in the shelter",
            is_user:false,
        },
        {
            content:"that is good to hear, when can i pick him up",
            is_user:true,
        },
        {
            content:"you can pick him up tomorrow",
            is_user:false,
        },
        {
            content:"you can pick him up tomorrow",
            is_user:false,
        },
        {
            content:"you can pick him up tomorrow",
            is_user:false,
        }
    ]


    // TODO: when the user types something in the chat

    const[open, setOpen] = useState(false)

    const toggle = () => { 
        setOpen(!open)
    }

    const chatboxRef = useRef(null)

    useEffect(()=>{
        if(chatboxRef.current && open){
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight
        }
    }, [open])
    return <>
        <div className="chat-wrapper d-flex flex-column">
            <a className="btn btn-success mt-3 text-white" onClick={toggle}>
                Chat with the Applicant
            </a> {
                open && (
                    <div className="chatbox-wrapper d-flex flex-column card card-body" ref={chatboxRef}>
                    {
                        test_message_data.map((message, index) => {
                            let styling ="user-styling rounded-2"
                            let alignment = "text-right"
                            if(!message.is_user){
                                styling = "recipiant-styling rounded-2"
                                alignment = "text-left"
                            }
                            return<>
                            <div className={alignment}>
                                <div className={styling} key={index}>
                                    <p>{message.content}</p>
                                </div>
                            </div>
                            </>
                        })
                    }
                    
                    </div>
                )
            }
            {open && 
                <form className="card-footer rounded pt-3 d-flex flex-row ">
                    <input type="text" class="message-field rounded" placeholder="Type something..."/>
                    <button className="btn btn-success rounded-circle" >
                        {'>'}
                    </button>
                </form>
            }
            
        </div>
        

        
    </>
}


export default ApplicationComments;