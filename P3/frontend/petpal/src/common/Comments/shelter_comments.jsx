
import { Link } from 'react-router-dom'
import { useState } from 'react'
import './comments.css'
import { all } from 'axios'
function ShelterComments(){

    const test_comment_name = "Jeff"
    const test_shelter_name = "big dawg shelter"
    // TODO: change these to actual data that we pass around using useState and useEffect


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

    const [comment_rating, setCommentRating] = useState(0);
    const handle_rating = (event) => { 
        setCommentRating(parseInt(event.target.value));
       
    }

    const [comment_content, setCommentContent] = useState("");  
    const handle_content = (event) => {
        setCommentContent(event.target.value);
    }



    const packaged_data={
        commenter_name: test_comment_name,
        shelter_name: test_shelter_name,
        comment: comment_content,
        rating: comment_rating,
    }
    console.log(packaged_data)
    
    const update_comments = (event) => {
        //this is test data for now, when this is implemented, this will be an actual call to the backend
        // using axios, useeffect and usestate
        event.preventDefault();
        let all_comments = document.getElementById("all-comments"); 
        let new_comment_wrapper = document.createElement("div");
        new_comment_wrapper.className = "comment-wrapper";
        let inner_wrapper = document.createElement("div");
        inner_wrapper.className = "inner-wrapper";
        inner_wrapper.key = 22;

        let shelter_name = document.createElement("h5");
        shelter_name.className = "display-8";
        shelter_name.innerHTML = "Shelter: " + packaged_data.shelter_name;


        let commenter_name = document.createElement("p");   
        commenter_name.innerHTML = "Commenter: " + packaged_data.commenter_name;

        let comment = document.createElement("p");
        comment.innerHTML = packaged_data.comment;

        let rating = document.createElement("p");
        rating.innerHTML = "Rating: " + packaged_data.rating + "/5";

        inner_wrapper.appendChild(shelter_name);
        inner_wrapper.appendChild(commenter_name);
        inner_wrapper.appendChild(comment);
        inner_wrapper.appendChild(rating);

        new_comment_wrapper.appendChild(inner_wrapper);
        all_comments.appendChild(new_comment_wrapper);
    }   

    return <>
        <div className="super-wrapper w-100 h-100 d-flex flex-column">
            <div className="comment-wrapper" onSubmit={update_comments}>
                <form className="rounded pt-3 d-flex flex-row ">
                    <input type="text" class="message-field rounded" placeholder="Type something..." onChange={handle_content}/>
                    <select id="rating_select" value={comment_rating} onChange={handle_rating}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </select>
                    <button className="btn btn-success rounded-oval" type="submit" >
                        Add Review
                    </button>
                </form>
            </div>

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