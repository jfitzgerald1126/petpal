
import { Link } from 'react-router-dom'
import { useState } from 'react'
import './comments.css'
import { all } from 'axios'
function ShelterComments(){
    const test_shelter_comment_data= [
        {
            commenter_name: "test_commenter_name",  
            shelter_name: "test_shelter_name",
            comment: "test_comment",
            rating: 4,
        },
        {
            commenter_name: "test_commenter_name2",
            shelter_name: "test_shelter_name",
            comment: "test_comment2",
            rating: 3,
        },
        {
            commenter_name: "test_commenter_name3",
            shelter_name: "test_shelter_name",
            comment: "test_comment3",
            rating: 2,
        },
        {
            commenter_name: "test_commenter_name4",
            shelter_name: "test_shelter_name",
            comment: "test_comment4",
            rating: 5,
        }
    
    ]

    // const [comment_rating, setCommentRating] = useState(0);


    return <>
        <div className="super-wrapper w-100 h-100 d-flex flex-column">

            {/* <div>
                <p>{comment_rating}</p>
            </div> */}
            <div id="all-comments">
                {
                    test_shelter_comment_data.map((comment, index) => {
                        return <>
                            <div className="comment-wrapper">
                                <div key={index}>
                                    <h5 className='display-8'> Shelter: {comment.shelter_name}</h5>
                                    <p> Commenter: {comment.commenter_name}</p>
                                    <p>{comment.comment}</p>
                                    <p>Rating: {comment.rating}/5</p>
                                </div>
                            </div>
                        </>
                    })
                }
            </div>
            


        </div>
    
    
    
    
    </>

}



export default ShelterComments