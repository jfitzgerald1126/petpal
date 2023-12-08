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
                <header className="landing-page-header position-fixed top-0 left-0 d-flex flex-row align-items-center justify-content-between">
                    <Link to="/" style={{textDecoration:'none'}}>
                        <a className="petpalLogo fs-3 ms-3 text-white fw-medium text-decoration-none">Petpal</a>
                    </Link>
                    <Link to="/login" style={{textDecoration:'none'}}>
                        <button className="login-button mx-3">Login</button>
                    </Link>

                </header>
            }
            {user && user.type == "seeker" && 
                <header className="landing-page-header position-fixed top-0 left-0 d-flex flex-row align-items-center justify-content-between">
                    <div className="mx-3 d-flex flex-row">
                    <Link to="/search" style={{textDecoration:'none'}}>
                        <a className="petpalLogo fs-3 text-white fw-medium text-decoration-none">Petpal</a>
                    </Link>
                    <div className="navLinksContainer">
                        <Link to="/search" style={{textDecoration:'none'}}>
                            <a className="text-white fw-medium text-decoration-none">Search</a>
                        </Link>
                        <Link to="/profile#applications" style={{textDecoration:'none'}}>
                            <a className="text-white fw-medium text-decoration-none">Applications</a>
                        </Link>
                    </div>
                    </div>
                    <div className="d-flex flex-row">
                    <div className="notificationDropdown dropdown">
                        <div className="notificationBell" style={{cursor:'pointer'}} onClick={() => setNotifOpen(!notifOpen)}>
                            <img src={bell}/>
                        </div>
                        {notifOpen && <div className="dropdown-menu" id="notifications">
                            <a className="dropdown-item" href="#">You recieved a new message from Annex Dog Rescue <span>| Oct 12, 2023</span></a>
                            <a className="dropdown-item" href="#">Your adoption application for Ronald was accepted by Annex Dog Rescue <span>| Oct 11, 2023</span></a>
                            <a className="dropdown-item" href="#">Your adoption application for Bert was rejected by Annex Dog Rescue <span>| Oct 11, 2023</span></a>
                        </div>}
                    </div>
                    <div className="profileDropdown dropdown">
                        <div className="pfp" style={{cursor:'pointer'}} onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <img src={user.seeker.profile_image}/>
                        </div>
                        {dropdownOpen && <div className="dropdown-menu" id="profileDropdown">
                            <Link to={`/seekers/${user.seeker.id}/`} style={{textDecoration:'none'}}>
                                <a className="dropdown-item">My profile</a>
                            </Link>
                            <Link to={`/seekers/${user.seeker.id}/edit/`} style={{textDecoration:'none'}}>
                                <a className="dropdown-item">Edit profile</a>
                            </Link>
                            <a className="dropdown-item" style={{cursor:'pointer'}} onClick={signOut}>Log out</a>
                        </div>}
                    </div>
                    </div>
                </header>
            }
            {user && user.type == "shelter" && 
                <header className="landing-page-header position-fixed top-0 left-0 d-flex flex-row align-items-center justify-content-between">
                    <div className="mx-3 d-flex flex-row">
                    <Link to="/search" style={{textDecoration:'none'}}>
                        <a className="petpalLogo fs-3 text-white fw-medium text-decoration-none">Petpal</a>
                    </Link>
                    <div className="navLinksContainer">
                        <Link to="/profile/shelter/#active_pets" style={{textDecoration:'none'}}>
                            <a className="text-white fw-medium text-decoration-none">Pets</a>
                        </Link>
                        <Link to="/profile/shelter/#applications" style={{textDecoration:'none'}}>
                            <a className="text-white fw-medium text-decoration-none">Applications</a>
                        </Link>
                    </div>
                    </div>
                    <div className="d-flex flex-row">
                    <div className="notificationDropdown dropdown">
                        <div className="notificationBell" style={{cursor:'pointer'}} onClick={() => setNotifOpen(!notifOpen)}>
                            <img src={bell}/>
                        </div>
                        {notifOpen && <div className="dropdown-menu" id="notifications">
                            <a className="dropdown-item" href="#">You recieved a new message from Annex Dog Rescue <span>| Oct 12, 2023</span></a>
                            <a className="dropdown-item" href="#">Your adoption application for Ronald was accepted by Annex Dog Rescue <span>| Oct 11, 2023</span></a>
                            <a className="dropdown-item" href="#">Your adoption application for Bert was rejected by Annex Dog Rescue <span>| Oct 11, 2023</span></a>
                        </div>}
                    </div>
                    <div className="profileDropdown dropdown">
                        <div className="pfp" style={{cursor:'pointer'}} onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <img src={user.shelter.shelter_image}/>
                        </div>
                        {dropdownOpen && <div className="dropdown-menu" id="profileDropdown">
                            <Link to="/profile" style={{textDecoration:'none'}}>
                                <a className="dropdown-item">My profile</a>
                            </Link>
                            <Link to="/profile/edit" style={{textDecoration:'none'}}>
                                <a className="dropdown-item">Edit profile</a>
                            </Link>
                            <a className="dropdown-item" style={{cursor:'pointer'}} onClick={signOut}>Log out</a>
                        </div>}
                    </div>
                    </div>
                </header>
            }
        </>
    )
}

export default Navbar