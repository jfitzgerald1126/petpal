import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext';
import bell from '../assets/bell.png'

const Navbar = () => {
    const {user, logoutUser} = useUserContext();
    const navigate = useNavigate();

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [notifOpen, setNotifOpen] = useState(false)

    const signOut = () => {
        logoutUser();
        localStorage.clear();
        navigate('/login')
    }

    
    return (
        <>
            {!user && 
                <header class="landing-page-header position-fixed top-0 left-0 d-flex flex-row align-items-center justify-content-between">
                    <Link to="/" style={{textDecoration:'none'}}>
                        <a class="petpalLogo fs-3 ms-3 text-white fw-medium text-decoration-none">Petpal</a>
                    </Link>
                    <Link to="/login" style={{textDecoration:'none'}}>
                        <button class="login-button mx-3">Login</button>
                    </Link>

                </header>
            }
            {user && user.type == "seeker" && 
                <header class="landing-page-header position-fixed top-0 left-0 d-flex flex-row align-items-center justify-content-between">
                    <div class="mx-3 d-flex flex-row">
                    <Link to="/search" style={{textDecoration:'none'}}>
                        <a class="petpalLogo fs-3 text-white fw-medium text-decoration-none">Petpal</a>
                    </Link>
                    <div class="navLinksContainer">
                        <Link to="/search" style={{textDecoration:'none'}}>
                            <a class="text-white fw-medium text-decoration-none">Search</a>
                        </Link>
                        <Link to="/profile#applications" style={{textDecoration:'none'}}>
                            <a class="text-white fw-medium text-decoration-none">Applications</a>
                        </Link>
                    </div>
                    </div>
                    <div class="d-flex flex-row">
                    <div class="notificationDropdown dropdown">
                        <div class="notificationBell" style={{cursor:'pointer'}} onClick={() => setNotifOpen(!notifOpen)}>
                            <img src={bell}/>
                        </div>
                        {notifOpen && <div class="dropdown-menu" id="notifications">
                            <a class="dropdown-item" href="#">You recieved a new message from Annex Dog Rescue <span>| Oct 12, 2023</span></a>
                            <a class="dropdown-item" href="#">Your adoption application for Ronald was accepted by Annex Dog Rescue <span>| Oct 11, 2023</span></a>
                            <a class="dropdown-item" href="#">Your adoption application for Bert was rejected by Annex Dog Rescue <span>| Oct 11, 2023</span></a>
                        </div>}
                    </div>
                    <div class="profileDropdown dropdown">
                        <div class="pfp" style={{cursor:'pointer'}} onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <img src={user.seeker.profile_image}/>
                        </div>
                        {dropdownOpen && <div class="dropdown-menu" id="profileDropdown">
                            <Link to="/profile" style={{textDecoration:'none'}}>
                                <a class="dropdown-item">My profile</a>
                            </Link>
                            <Link to="/profile/edit" style={{textDecoration:'none'}}>
                                <a class="dropdown-item">Edit profile</a>
                            </Link>
                            <a class="dropdown-item" style={{cursor:'pointer'}} onClick={signOut}>Log out</a>
                        </div>}
                    </div>
                    </div>
                </header>
            }
            {user && user.type == "shelter" && 
                <header class="landing-page-header position-fixed top-0 left-0 d-flex flex-row align-items-center justify-content-between">
                    <div class="mx-3 d-flex flex-row">
                    <Link to="/search" style={{textDecoration:'none'}}>
                        <a class="petpalLogo fs-3 text-white fw-medium text-decoration-none">Petpal</a>
                    </Link>
                    <div class="navLinksContainer">
                        <Link to="/profile#active_pets" style={{textDecoration:'none'}}>
                            <a class="text-white fw-medium text-decoration-none">Pets</a>
                        </Link>
                        <Link to="/profile#applications" style={{textDecoration:'none'}}>
                            <a class="text-white fw-medium text-decoration-none">Applications</a>
                        </Link>
                    </div>
                    </div>
                    <div class="d-flex flex-row">
                    <div class="notificationDropdown dropdown">
                        <div class="notificationBell" style={{cursor:'pointer'}} onClick={() => setNotifOpen(!notifOpen)}>
                            <img src={bell}/>
                        </div>
                        {notifOpen && <div class="dropdown-menu" id="notifications">
                            <a class="dropdown-item" href="#">You recieved a new message from Annex Dog Rescue <span>| Oct 12, 2023</span></a>
                            <a class="dropdown-item" href="#">Your adoption application for Ronald was accepted by Annex Dog Rescue <span>| Oct 11, 2023</span></a>
                            <a class="dropdown-item" href="#">Your adoption application for Bert was rejected by Annex Dog Rescue <span>| Oct 11, 2023</span></a>
                        </div>}
                    </div>
                    <div class="profileDropdown dropdown">
                        <div class="pfp" style={{cursor:'pointer'}} onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <img src={user.shelter.shelter_image}/>
                        </div>
                        {dropdownOpen && <div class="dropdown-menu" id="profileDropdown">
                            <Link to="/profile" style={{textDecoration:'none'}}>
                                <a class="dropdown-item">My profile</a>
                            </Link>
                            <Link to="/profile/edit" style={{textDecoration:'none'}}>
                                <a class="dropdown-item">Edit profile</a>
                            </Link>
                            <a class="dropdown-item" style={{cursor:'pointer'}} onClick={signOut}>Log out</a>
                        </div>}
                    </div>
                    </div>
                </header>
            }
        </>
    )
}

export default Navbar