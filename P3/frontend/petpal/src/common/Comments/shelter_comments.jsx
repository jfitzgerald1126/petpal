
import { useState, useEffect} from 'react'
import { Link , useNavigate,  useParams} from 'react-router-dom'
import './comments.css'
import axios from 'axios'


import { useUserContext } from '../../contexts/UserContext.jsx';
function ShelterComments(){


    let {shelter_id} = useParams()
    console.log("shelter_id",shelter_id)
    let base_url ='http://127.0.0.1:8000/'
    let shelter_comments_append=`comments/review/${shelter_id}/`

    const navigate = useNavigate();

    const [comment_data, setCommentData] = useState([]); // this will be an array of objects, each object will have the following fields: commenter_name, shelter_name, comment, rating
    const [formattedCommentData, setFormattedCommentData] = useState([])
    const[nextPageUrl, setNextPageUrl] = useState(null)
    const[previousPageUrl, setPreviousPageUrl] = useState(null)
    console.log("next page url", nextPageUrl)
    console.log("previous page url", previousPageUrl)

    useEffect(() => {
        let is_mounted = true;
        if(localStorage.getItem('access_token') === null){
            navigate('/login/')
        }
        const fetch_comments = async () => {
            console.log("fetching comment data")
            try{
                const response = await axios.get(base_url+shelter_comments_append, {headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}})
                if(response.data.next !== null){
                    setNextPageUrl(response.data.next)
                }
                if(response.data.previous !== null){
                    setPreviousPageUrl(response.data.previous)
                }
                // console.log("response",response.data)
                if(is_mounted){
                    const comments_list = response.data.results
                    setCommentData(comments_list)
                    // console.log(response.results)
                }
            } catch(error){
                console.log("error retrieving comments",error)
            }
            console.log("finished fetching data")
        };
        fetch_comments();
        return () => {is_mounted = false}
        // cleanup function 
    },[])
    console.log("comment data: ",comment_data)

    


    const fetch_commenter_info = async (commenter_id) => {
        // this will be an object with the following fields: name, email, phone_number, address, city, state, zipcode, profile_picture
        try{
            let user_info_append = `accounts/user/${commenter_id}/`
            const response = await axios.get(base_url+user_info_append, {headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}})
            return response.data.name
        }catch(error){
            console.log("error retrieving commenter info",error)
            return ""
        }
    }

    // fetch_commenter_info(2)

    const format_comment_info = async (comment_data) => {
        let formatted_comment_data =[]
        for( const comment of comment_data){
            let commenter_id = comment.commenter_id
            let commenter_name = await fetch_commenter_info(commenter_id) 
            let individual_comment= {
                commenter_name: commenter_name,
                comment: comment.content,
                rating: comment.rating,
                date: comment.date,
            }
            formatted_comment_data.push(individual_comment)
        };
        setFormattedCommentData(formatted_comment_data)
    }

    useEffect(() => {
        format_comment_info(comment_data)
    }, [comment_data])

    useEffect(() => {
        console.log("FORMAT COMMENT DATA", formattedCommentData)
    }, [formattedCommentData])

    
    

    const [comment_rating, setCommentRating] = useState(0);
    const handle_rating = (event) => { 
        setCommentRating(parseInt(event.target.value));
       
    }

    const [comment_content, setCommentContent] = useState("");  
    const handle_content = (event) => {
        setCommentContent(event.target.value);
    }

    const {user} = useUserContext();
    let user_id  = 0
    if(user !== null){
        if (user.type === "seeker"){
            user_id = user.seeker.user
            console.log("user_id",user_id)
        }
        if (user.type === "shelter"){
            user_id = user.shelter.user
            console.log("user_id",user_id)
        }
    }
        
    const next_page = () => {
        if (nextPageUrl !== null){
            axios.get(nextPageUrl, {headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}})
            .then((response) => {
                setCommentData(response.data.results)
                setNextPageUrl(response.data.next)
                setPreviousPageUrl(response.data.previous)
            })
            .catch((error) => {
                console.log("error retrieving next page", error)
            })
        }
    }

    const previous_page = () => {
        if (previousPageUrl !== null){
            axios.get(previousPageUrl, {headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}})
            .then((response) => {
                setCommentData(response.data.results)
                setNextPageUrl(response.data.next)
                setPreviousPageUrl(response.data.previous)
            })
            .catch((error) => {
                console.log("error retrieving previous page", error)
            })
        }
    }
    

    
    const packaged_data={
        shelter_id: Number(shelter_id),
        commenter_id: user_id,
        content: comment_content,
        rating: comment_rating,
    }
    console.log("packaged_data:",packaged_data)
    
    const update_comments = async(event) => {
        //this is test data for now, when this is implemented, this will be an actual call to the backend
        // using axios, useeffect and usestate
        event.preventDefault();

        try{
            await axios({
                method: 'post',
                url: base_url+shelter_comments_append,
                data: packaged_data,
                headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}

            })
            console.log("posted comment!")
            }catch(error){
                console.log("error posting comment",error)
            }
    };

       

    return <>
        
        <div className="super-wrapper w-100 h-100 d-flex flex-column">
            
            <div id="all-comments h-100">
                {
                    formattedCommentData.map((comment, index) => {
                        return <>
                            <div className="comment-wrapper">
                                <div key={index}>
                                    <h5 className='display-8'> Commenter: {comment.commenter_name}</h5>
                                    <p>{comment.comment}</p>
                                    <p>Date: {comment.date}</p>
                                    <p>Rating: {comment.rating}/5</p>
                                </div>
                            </div>
                        </>
                    })
                }
            </div>
            <div className='pagination-button-container'>
                    {
                        previousPageUrl && <button onClick={previous_page}>{'<'} Previous</button>
                    }
                    {
                        nextPageUrl && <button onClick={next_page}>Next {'>'}</button>
                    }

                </div>
            <div className="comment-wrapper" >
                <form className="rounded pt-3 d-flex flex-row " method="post" onSubmit={update_comments}>
                    <input type="text" class="message-field rounded" placeholder="Type something..." onChange={handle_content}/>
                    <select id="rating_select" value={comment_rating} onChange={handle_rating}>
                        <option value={0}>Rating</option>
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
            
        </div>
    
    
    
    
    </>

}



export default ShelterComments