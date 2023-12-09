import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../../contexts/UserContext';
import { Link } from 'react-router-dom';

const SeekerProfilePage = () => {
    const { user } = useUserContext();
    const [data, setData] = useState(null);
    const [applications, setApplicationsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const authToken = localStorage.getItem('access_token');

    useEffect(() => {
        setLoading(true);
        setError(null);
    
        const fetchSeekerProfile = axios.get(`http://localhost:8000/accounts/seekers/${user.seeker.id}/`, {
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
                    console.log(applicationsWithPets)
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
    }, [user, authToken]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        const errorCode = error.response?.status || 'Unknown';
        return <div>{errorCode} error: an error occurred</div>;
    }
    return (
        <div className="page-container">
        <div className="super-wrapper w-100 h-100 d-flex flex-column align-items-center">
      <div className="profile-wrapper w-75 d-flex flex-column align-items-left">
        <h1>Your Profile</h1>
        <div className="picture-and-contact w-75 d-flex mt-3">

          <div className="headshot-wrapper">
            <img src={data.profile_image ? data.profile_image : 'https://i.ibb.co/4jkCqdm/user.png'} alt="headshot" className="headshot w-100, h-100"/>
          </div>
          <div>
            <h3 className="fw-medium">{data.first_name} {data.last_name}</h3>
            <h4 className="fw-light" style={{fontSize:16}}>{data.email}</h4>
            <h4 className="fw-light" style={{fontSize:16}}>{data.address}</h4>
            <h4 className="fw-light" style={{fontSize:16}}>{ `(${data.phone_number.slice(0, 3)})-${data.phone_number.slice(3, 6)}-${data.phone_number.slice(6)}`}</h4>
          </div>

        </div>

        <p className="text-zinc-600 fs-10 mt-4">
        Bio: {data.description}
        </p>
        <a style={{width:'fit-content'}}>
            
        <Link to="edit">
          <button className="primary-button">
            Edit Profile
          </button>
        </Link>
        </a>

      </div>

      <h1 className="d-flex w-75">Your Applications</h1>
      <div className="application-wrapper w-75">

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
                                <td><Link to={`/application/${application.id}`}>View application</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

      </div>





    </div>
    </div>
    );
    


}
export default SeekerProfilePage;

