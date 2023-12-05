import '../../common/styles.css'
import { Link , useNavigate} from 'react-router-dom'
import { useEffect, useState } from 'react'
import  axios  from 'axios';



function TestHomePage(){

    const[message, setMessage] = useState("");


    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('access_token') === null){
            navigate('/login/')
        }           
    },[])

    return<>
        <h1>We should only see this if authentication and login was successful </h1>
    </>

}


export default TestHomePage