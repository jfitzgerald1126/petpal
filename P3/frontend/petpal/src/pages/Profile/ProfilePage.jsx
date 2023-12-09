import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../../contexts/UserContext';
import SeekerProfilePage from './SeekerProfilePage';
import ShelterProfilePage from './ShelterProfilePage';

const ProfilePage = () => {
    const {user} = useUserContext()

    return (
        <>
            {user?.type == "shelter" && <ShelterProfilePage />}
            {user?.type == "seeker" && <SeekerProfilePage />}
        </>
    )
}

export default ProfilePage