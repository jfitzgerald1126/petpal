import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../../contexts/UserContext';

const SeekerProfile = () => {
    const { user } = useUserContext();
    const [data, setData] = useState(null);
    const [applications, setApplicationsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const authToken = localStorage.getItem('access_token');
    const { id } = useParams();
    const redirectEdit = id + '/edit';
    useEffect(() => {
        setLoading(true);
        setError(null);
    
        const fetchSeekerProfile = axios.get(`http://localhost:8000/accounts/seekers/${id}/`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const fetchApplications = axios.get(`http://localhost:8000/pets/applications/`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
    
        Promise.all([fetchSeekerProfile, fetchApplications])
            .then(([profileResponse, applicationsResponse]) => {
                setData(profileResponse.data);
                // Fetch pet data for each application
                const petPromises = applicationsResponse.data.results.map(application =>
                    axios.get(`http://localhost:8000/pets/pet/${application.pet}/`, {
                        headers: { Authorization: `Bearer ${authToken}` }
                    })
                );
    
                return Promise.all(petPromises).then(pets => {
                    const applicationsWithPets = applicationsResponse.data.results.map((application, index) => ({
                        ...application,
                        petData: pets[index].data
                    }));
                    setApplicationsData(applicationsWithPets);
                });
            })
            .catch(error => {
                setError(error);
                console.error('Error fetching data', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id, authToken]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        const errorCode = error.response?.status || 'Unknown';
        return <div>{errorCode} error: an error occurred</div>;
    }
    return (
        <div className="super-wrapper w-100 h-100 d-flex flex-column align-items-center">
      <div className="profile-wrapper w-75 d-flex flex-column align-items-left">
        <h1>Your Profile</h1>
        <div className="picture-and-contact w-75 d-flex">

          <div className="headshot-wrapper">
            <img src={data.profile_image} alt="headshot" className="headshot w-100, h-100"/>
          </div>
          <div>
            <h3 className="fw-medium">{data.first_name} {data.last_name}</h3>
            <h4 className="fw-light">{data.email}</h4>
            <h4 className="fw-light">{data.address}</h4>
            <h4 className="fw-light">{data.phone_number}</h4>
          </div>

        </div>

        <p className="text-zinc-600 fs-8 mt-4">
        {data.description}
        </p>
        <a href={redirectEdit}>
          <button className="edit-button">
            Edit Profile
          </button>
        </a>

      </div>

      <h1 className="d-flex w-75">Your Applications</h1>
      <div className="application-wrapper h-40 w-75 overflow-y-scroll">

      <table className="table application-table w-100">
                    <thead>
                        <tr>
                            <th scope="col">Pet</th>
                            <th scope="col">Application Description</th>
                            <th scope="col">Created Date</th>
                            <th scope="col">Modified Date</th>
                            <th scope="col">Shelter Preferred Contact</th>
                            <th scope="col">Status</th>
                            <th scope="col">Application</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications && applications.map((application, index) => (
                            <tr key={index}>
                                <th scope="row">{application.petData.name}</th>
                                <td>{application.description}</td>
                                <td>{application.created_date}</td>
                                <td>{application.modified_date}</td>
                                <td>{application.preferred_contact}</td>
                                
                                <td className={application.status === 'Accepted' ? 'text-success' : application.status === 'Rejected' ? 'text-danger' : ''}>
                                    {application.status}
                                </td>
                                <td><a href="pet_application_page_seeker_view.html">View application</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

      </div>





    </div>
    );
    


}
export default SeekerProfile;

