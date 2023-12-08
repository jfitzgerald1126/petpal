import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../../contexts/UserContext';


function EditSeekerProfile() {
    const { user } = useUserContext();
    const [successMessage, setSuccessMessage] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMessages, setErrorMessages] = useState({});
    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        description: '',
        address: '',
        age: null,
        profile_image: null,
    });
    const { id } = useParams();
    const authToken = localStorage.getItem('access_token');

    // Function to handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleFileChange = (e) => {
        setProfile({ ...profile, profile_image: e.target.files[0] });
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage(''); // Reset success message
        setErrorMessages({});  // Reset error messages
        const formData = new FormData();
    
        // Append text fields to formData
        Object.keys(profile).forEach(key => {
            if (key !== 'profile_image') {
                formData.append(key, profile[key]);
            }
        });
    
        // Append the file to formData if it exists
        if (profile.profile_image instanceof File) {
            formData.append('profile_image', profile.profile_image);
        }
    
        try {
            const response = await axios.put(`http://localhost:8000/accounts/seekers/${id}/`, formData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setSuccessMessage('Profile updated successfully.');
        } catch (error) {
            console.error("Error updating profile:", error);
            if (error.response && error.response.data) {
                // Set error messages based on server response
                setErrorMessages(error.response.data);
            }
        }
    };

    // Fetch existing data when the component mounts
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/accounts/seekers/${id}/`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                setProfile(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        useEffect(() => {
            if (loading){
                fetchProfileData();
            }
        });

    useEffect(() => {
        if (user?.type === "seeker" && profile && !loading) {
            setIsOwner(user.seeker.id == id);
        } else {  
            setIsOwner(false);
        }
    }, [user, profile, loading]);

    if (!isOwner){
        return <div>Error: You do not have permission to edit this seeker profile.</div>
    }
    if (loading){
        return <div>loading...</div>
    }

    return (
        <div className="page-container">
        <main className="container pt-5">
            <div className="row mt-5 mx-auto">
                <h3 className="mb-5 fw-bold">Edit Profile</h3>
                <form onSubmit={handleSubmit} className="col-12">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <h6>First Name</h6>
                                <input
                                    type="text"
                                    className="form-control bg-zinc-100 text-zinc-500"
                                    name="first_name"
                                    placeholder="First Name"
                                    value={profile.first_name}
                                    onChange={handleChange}
                                    required
                                />
                                {errorMessages.first_name && <div className="text-danger">{errorMessages.first_name}</div>}
                            </div>
                            <div className="mb-3">
                                <h6>Last Name</h6>
                                <input
                                    type="text"
                                    className="form-control bg-zinc-100 text-zinc-500"
                                    name="last_name"
                                    placeholder="Last Name"
                                    value={profile.last_name}
                                    onChange={handleChange}
                                    required
                                />
                                {errorMessages.last_name && <div className="text-danger">{errorMessages.last_name}</div>}
                            </div>
                            <div className="mb-3">
                                <h6>Email</h6>
                                <input type="text" className="form-control bg-zinc-100 text-zinc-500" name="email" onChange={handleChange} id="email" placeholder="Email" value={profile.email}
                                    required />
                                    {errorMessages.email && <div className="text-danger">{errorMessages.email}</div>}
                            </div>

                            <div className="mb-3">
                                <h6>Phone</h6>
                                <input type="text" className="form-control bg-zinc-100 text-zinc-500" name="phone_number" onChange={handleChange} id="phone_number" placeholder="Phone" value={profile.phone_number} required />
                                {errorMessages.phone_number && <div className="text-danger">{errorMessages.phone_number}</div>}
                            </div>

                            <div className="mb-3">
                                <h6>Address</h6>
                                <input type="text" className="form-control bg-zinc-100 text-zinc-500" name="address" id="address" onChange={handleChange} placeholder="Address"
                                    value={profile.address} />
                                    {errorMessages.address && <div className="text-danger">{errorMessages.address}</div>}
                            </div>

                            <div className="mb-3">
                                <h6>Biography</h6>
                                <textarea id="description" className="form-control bg-zinc-100 text-zinc-500" onChange={handleChange} placeholder="Biography"
                                    style={{ height: '122px' }} name="description" value={profile.description}></textarea>
                                {errorMessages.description && <div className="text-danger">{errorMessages.description}</div>}
                            </div>
                            <div className="mb-3">
                                <h6>Age</h6>
                                <input type="number" className="form-control bg-zinc-100 text-zinc-500" id="age" onChange={handleChange} name="age" placeholder="Age" min="0" max="200"
                                    value={profile.age} />
                                    {errorMessages.age && <div className="text-danger">{errorMessages.age}</div>}
                            </div>
                            
                        </div>
                        <div className="col-md-6 d-flex justify-content-center">
                            <div className="flex-container">
                                <img src={profile.profile_image} className="img-fluid mt-2" alt="upload-image placeholder" />
                                <h6>Profile Photo</h6>
                                <input type="file" name="profile_image" onChange={handleFileChange} className="form-control bg-zinc-100 text-zinc-500 mt-md-0 mt-3" />
                                {errorMessages.profile_image && <div className="text-danger">{errorMessages.profile_image}</div>}
                                <button type="submit" className="btn btn-success ps-5 pe-5 mb-md-0 mb-3" style={{marginTop:'10px'}}>Update Profile</button>
                            {successMessage && <div className="text-success">{successMessage}</div>}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    </div>
    );
}

export default EditSeekerProfile;