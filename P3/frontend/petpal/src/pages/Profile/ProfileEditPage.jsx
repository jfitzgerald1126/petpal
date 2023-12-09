import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../contexts/UserContext';
import ShelterProfileEditPage from './ShelterProfileEditPage';
import SeekerProfileEditPage from './SeekerProfileEditPage';

const ProfileEditPage = () => {
    const {user} = useUserContext()

    return (
        <>
            {user?.type == "shelter" && <ShelterProfileEditPage />}
            {user?.type == "seeker" && <SeekerProfileEditPage />}
        </>
    )
}

export default ProfileEditPage