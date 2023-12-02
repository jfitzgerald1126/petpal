import { Link } from 'react-router-dom'
import { useState } from 'react'
import './comments.css'







function ApplicationComments(){

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
        }
    ]

    return <>
        
        <div className="chatbox-wrapper d-flex flex-column">
            {
                test_message_data.map((message, index) => {
                    let styling ="user-styling"
                    let alignment = "text-right"
                    if(!message.is_user){
                        styling = "recipiant-styling"
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
        
    </>
}


export default ApplicationComments;