import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../../contexts/UserContext';
import { Link } from 'react-router-dom';

const SeekerProfilePage = () => {
    const { user } = useUserContext();
    const [data, setData] = useState(null);
    const [applications, setApplicationsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [appDropdownOpen, setAppDropdownOpen] = useState(false)
    const [app2DropdownOpen, setApp2DropdownOpen] = useState(false)
    const [status, setStatus] = useState('pending')
    const [sort, setSort] = useState('-modified_date')
    const authToken = localStorage.getItem('access_token');



    const fetchApps = async (pagedUrl) => {
        let url = pagedUrl ? pagedUrl : 'http://127.0.0.1:8000/pets/applications/'
        let pet_url = 'http://127.0.0.1:8000/pets/pet/'

        
        const params = {
            'status': status,
            'sort': sort
        }

        try {
            const accumulator = []
            const authToken = localStorage.getItem('access_token')
            
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                params: params,
            });
            for (let i=0;i<response.data.results.length;i++) {
                const app = response.data.results[i]
                const pet_response = await axios.get(pet_url + app.pet, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                })
                
                app.pet_name = pet_response.data.name
                accumulator.push(response.data.results[i])
            }
            setApplicationsData({
                next: response.data.next,
                previous: response.data.previous, 
                results: accumulator
            })
        } catch (error) {
          setError(error);
        }
    }

    useEffect(() => {
        setLoading(true);
        setError(null);
    
        const fetchSeekerProfile = axios.get(`http://localhost:8000/accounts/seekers/${user.seeker.id}/`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
    
        Promise.all([fetchSeekerProfile])
            .then(([profileResponse]) => {
                setData(profileResponse.data);
            })
            .catch(error => {
                setError(error);
                console.error('Error fetching data', error);
            })
            .finally(() => {
                setLoading(false);
            });
            fetchApps()
    }, [user, authToken]);

    const sort_mapping = {
        'created_date': 'Created',
        '-created_date': 'Created Desc',
        'modified_date': 'Modified',
        '-modified_date': 'Modified Desc',
    }


    useEffect(() => {
        fetchApps()
    }, [status, sort])

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

      <div className="d-flex flex-row" style={{gap:10}}>
      <div className="dropdown" style={{position:'relative', marginBottom: 20,}}>

        <button className="btn btn-secondary dropdown-toggle text-capitalize" type="button" onClick={()=>setAppDropdownOpen(!appDropdownOpen)} id="dropdownMenuButton" data-expanded="false">
            {status}
        </button>
            {appDropdownOpen && 
                <div className="dropdown-menu dropdown-menu-left-screen-edge" id="dropdownMenu">
                    <a className="dropdown-item" href="#" onClick={() => {setStatus('pending'); setAppDropdownOpen(false)}}>Pending</a>
                    <a className="dropdown-item" href="#" onClick={() => {setStatus('accepted'); setAppDropdownOpen(false)}}>Accepted</a>
                    <a className="dropdown-item" href="#" onClick={() => {setStatus('denied'); setAppDropdownOpen(false)}}>Denied</a>
                    <a className="dropdown-item" href="#" onClick={() => {setStatus('withdrawn'); setAppDropdownOpen(false)}}>Withdrawn</a>
                </div>
            }
        </div>
        <div className="dropdown" style={{position:'relative', marginBottom: 20,}}>

        <button className="btn btn-secondary dropdown-toggle text-capitalize" type="button" onClick={()=>setApp2DropdownOpen(!app2DropdownOpen)} id="dropdownMenuButton" data-expanded="false">
            {sort_mapping[sort]}
        </button>
            {app2DropdownOpen && 
                <div className="dropdown-menu dropdown-menu-left-screen-edge" id="dropdownMenu">
                    <a className="dropdown-item" href="#" onClick={() => {setSort('created_date'); setApp2DropdownOpen(false)}}>Created</a>
                    <a className="dropdown-item" href="#" onClick={() => {setSort('modified_date'); setApp2DropdownOpen(false)}}>Modified</a>
                    <a className="dropdown-item" href="#" onClick={() => {setSort('-created_date'); setApp2DropdownOpen(false)}}>Created Desc</a>
                    <a className="dropdown-item" href="#" onClick={() => {setSort('-modified_date'); setApp2DropdownOpen(false)}}>Modified Desc</a>
                </div>
            }
        </div>
        </div>
        {applications?.results?.length > 0 ? 
                <>
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
                        {applications?.results?.map((application, index) => (
                            <tr key={index}>
                                <th scope="row">{application.pet_name}</th>
                                <td>{application.description.length < 20 ? application.description : application.description.slice(0, 20) + '...'}</td>
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
                <div style={{display:'flex', flexDirection:'row', gap:10}}> 
                    {applications?.previous && <button className='pagination-btn' onClick={()=>fetchApps(applications?.previous)}>{'<'} Previous</button>}
                    {applications?.next && <button className='pagination-btn' onClick={()=>fetchApps(applications?.next)} >Next {'>'}</button>}
                </div>
                </>
                : 
                <span>No applications found</span>
        }

      </div>





    </div>
    </div>
    );
    


}
export default SeekerProfilePage;

