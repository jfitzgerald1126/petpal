import React, { useEffect } from 'react';
import { useUserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import SeekerApplication from '../../components/SeekerApplication';
import ShelterApplication from '../../components/ShelterApplication';

export default function ViewApplication() {
    const { user } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('access_token') === null){
            navigate('/login/')
        }
    }, []);

    if (user && user.type === 'shelter') {
        return <ShelterApplication />
    } else if (user && user.type === 'seeker') {
        return <SeekerApplication />
    } 
}
