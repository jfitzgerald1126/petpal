
import { useEffect, useInsertionEffect, useMemo, useRef, useState } from 'react';
import { Link, useFetcher } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep';
import PetCard from '../../components/PetCard';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { useUserContext } from '../../contexts/UserContext';
import { useNavigate, useParams } from 'react-router-dom';

const ShelterProfilePage = () => {

    const { user } = useUserContext();
    const [shelter, setShelter] = useState(null)
    const [activePets, setActivePets] = useState([])
    const [withdrawnPets, setWithdrawnPets] = useState([])
    const [pendingApps, setPendingApps] = useState([])
    const [acceptedApps, setAcceptedApps] = useState([])
    const [deniedApps, setDeniedApps] = useState([])
    const [withdrawnApps, setWithdrawnApps] = useState([])
    const [adoptedPets, setAdoptedPets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [appDropdownOpen, setAppDropdownOpen] = useState(false)
    const [appType, setAppType] = useState('pending')


    const fetchData = async () => {
        let url = 'http://127.0.0.1:8000/accounts/shelters/' + user.shelter.id

        try {
          const authToken = localStorage.getItem('access_token')
          const response = await axios.get(url, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
          });
          setShelter(response.data);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
    }

    const fetchPets = async (status, setPets) => {
        let url = 'http://127.0.0.1:8000/pets/pets/'

        const params = {
            'shelter': user.shelter.id,
            'status': status,
        }

        try {
            const accumulator = []
            const authToken = localStorage.getItem('access_token')
            
            while (true) {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                    params: params,
                });
                for (let i=0;i<response.data.results.length;i++) {
                    accumulator.push(response.data.results[i])
                }
                if (!response.data.next) {
                    break;
                }
                else {
                    url = response.data.next
                }
            }

            setPets(accumulator);
        } catch (error) {
          setError(error);
        }
    }

    const fetchApps = async (status, setApps) => {
        let url = 'http://127.0.0.1:8000/pets/applications/'
        let pet_url = 'http://127.0.0.1:8000/pets/pet/'
        let user_url = 'http://127.0.0.1:8000/accounts/seekers/'

        const params = {
            'status': status,
            'shelter': user.shelter.id,
        }

        try {
            const accumulator = []
            const authToken = localStorage.getItem('access_token')
            
            while (true) {
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
                    const seeker_response = await axios.get(user_url + app.seeker, {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        }
                    })
                    app.pet_name = pet_response.data.name
                    console.log(seeker_response)
                    app.seeker_name = seeker_response.data.first_name
                    app.seeker_email = seeker_response.data.email
                    accumulator.push(response.data.results[i])
                }
                if (!response.data.next) {
                    break;
                }
                else {
                    url = response.data.next
                }
            }

            setApps(accumulator);
        } catch (error) {
          setError(error);
        }
    }


    // useEffect(() => {
    //     console.log(apps)
    // }, [apps])

    useEffect(() => {
        if (user?.type == "shelter") {
            fetchData();
            fetchPets('available', setActivePets);
            fetchPets('withdrawn', setWithdrawnPets);
            fetchPets('adopted', setAdoptedPets);
            fetchApps('pending', setPendingApps);
            fetchApps('accepted', setAcceptedApps);
            fetchApps('denied', setDeniedApps);
            fetchApps('withdrawn', setWithdrawnApps);
        }
    }, [user])

    const app_mapping = {
        'pending': pendingApps,
        'accepted': acceptedApps,
        'denied': deniedApps,
        'withdrawn': withdrawnApps
    }


    return (
        <>
        {!loading && 
                <div className="page-container d-flex flex-column align-items-center">
            <div className='h-100 d-flex flex-column align-items-center'>
            <div className="shelter-container d-flex">
                <div className="shelter-images-container d-flex flex-column align-items-end">
                <div className="shelter-cover-image"><img src={shelter.shelter_image ? shelter.shelter_image : 'https://i.ibb.co/4JLwVSq/shelter.png'}/></div>
                </div>
                <div className="shelter-details-container d-flex flex-column align-items-start">
                <h1 className="text-zinc-700 fs-3 fw-bold">{shelter.shelter_name}</h1>
                <div className="shelter-info-container d-flex flex-row">
                    <div className="d-flex flex-column pe-5">
                    <span className="text-zinc-400 fs-8">{shelter.website}</span>
                    {shelter.phone_number && <span className="text-zinc-400 fs-8">{ `(${shelter.phone_number.slice(0, 3)})-${shelter.phone_number.slice(3, 6)}-${shelter.phone_number.slice(6)}`}</span>}
                    </div>
                    <div className="d-flex flex-column">
                    <span className="text-zinc-400 fs-8">{shelter.email}</span>
                    <span className="text-zinc-400 fs-8">{shelter.address}</span>
                    </div>
                </div>
                <p className="text-zinc-600 fs-8 mt-4">Description: {shelter.description}</p>
                    <Link to="edit" style={{textDecoration:'none'}}>
                        <button className="primary-button">Edit profile</button>
                    </Link>
                </div>
            </div>

            <div id="applications" className="w-100 px-5 mt-5 mb-2 d-flex flex-column align-items-start">
                <div className="d-flex flex-row">
                    <h1 className="text-zinc-700 fs-3 fw-bold">Applications</h1>
                    <div className="dropdown" style={{position:'relative'}}>
                    <button style={{marginLeft:20}} className="btn btn-secondary dropdown-toggle text-capitalize" type="button" onClick={()=>setAppDropdownOpen(!appDropdownOpen)} id="dropdownMenuButton" data-expanded="false">
                        {appType}
                    </button>
                        {appDropdownOpen && 
                            <div className="dropdown-menu dropdown-menu-right-screen-edge" id="dropdownMenu">
                                <a className="dropdown-item" href="#" onClick={() => {setAppType('pending'); setAppDropdownOpen(false)}}>Pending</a>
                                <a className="dropdown-item" href="#" onClick={() => {setAppType('accepted'); setAppDropdownOpen(false)}}>Accepted</a>
                                <a className="dropdown-item" href="#" onClick={() => {setAppType('denied'); setAppDropdownOpen(false)}}>Denied</a>
                                <a className="dropdown-item" href="#" onClick={() => {setAppType('withdrawn'); setAppDropdownOpen(false)}}>Withdrawn</a>
                            </div>
                        }
                    </div>
                </div>
            <div className="pending-applications">
              {app_mapping[appType].length > 0 ? <table className="table application-table w-100 mt-2">
                <thead>
                  <tr>
                    <th scope="col">Applicant</th>
                    <th scope="col">Pet</th>
                    <th scope="col">Date</th>
                    <th scope="col">Email</th>
                    <th scope="col">Status</th>
                    <th scope="col">Application</th>
                  </tr>
                </thead>
                {app_mapping[appType].map((app) => {
                     const inputDate = new Date(app.created_date);
                     const month = String(inputDate.getMonth() + 1).padStart(2, '0');
                    const day = String(inputDate.getDate()).padStart(2, '0');
                    const year = inputDate.getFullYear();
                    const formattedDate = `${month}/${day}/${year}`;

                    return (
                        <tr>
                            <td>{app.seeker_name}</td>
                            <td>{app.pet_name}</td>
                            <td>{formattedDate}</td>
                            <td>{app.seeker_email}</td>
                            <td>{app.status}</td>
                            <td><Link to={`/application/${app.id}`}>View application</Link></td>
                        </tr>
                    )
                })}
              </table>: 
                <span>No applications found</span>
              }
            </div>
          </div>

            <div id="active_pets" class="our-friends-container w-100 px-5 mt-3 d-flex flex-column align-items-start">
                <div className="d-flex flex-row">
                <h1 className="text-zinc-700 fs-3 fw-bold">Active Listings</h1>
                <Link to="/pet/create" style={{textDecoration:'none'}}>
                    <button className="primary-button mx-3">List new pet</button>
                </Link>
                </div>
                <div className="shelter-pets-container">
                    {activePets?.map((pet) => {
                            return (
                                <PetCard 
                                    id={pet.id}
                                    image={pet.profile_image}
                                    status={pet.status}
                                    listed={pet.listed}
                                    name={pet.name}
                                    shelter={pet.shelter}
                                    animal={pet.animal}
                                    birthday={pet.birthday}
                                    description={pet.description}
                                />
                            )
                        })
                    }
                    {activePets.length == 0 && <span>Nothing to see here</span>}
                </div>
            </div>

            <div className="our-friends-container w-100 px-5 mt-3 d-flex flex-column align-items-start">
            <h1 className="text-zinc-700 fs-3 fw-bold">Withdrawn Listings</h1>
              <div className="shelter-pets-container">
                    {withdrawnPets?.map((pet) => {
                            return (
                                <PetCard 
                                    id={pet.id}
                                    image={pet.profile_image}
                                    status={pet.status}
                                    listed={pet.listed}
                                    name={pet.name}
                                    shelter={pet.shelter}
                                    animal={pet.animal}
                                    birthday={pet.birthday}
                                    description={pet.description}
                                />
                            )
                        })
                    }
                {withdrawnPets.length == 0 && <span>Nothing to see here</span>}
             </div>
    
          </div>


          <div className="our-friends-container w-100 px-5 mt-3 d-flex flex-column align-items-start">
            <h1 className="text-zinc-700 fs-3 fw-bold">Adopted Listings</h1>
              <div className="shelter-pets-container">
                    {adoptedPets?.map((pet) => {
                            return (
                                <PetCard 
                                    id={pet.id}
                                    image={pet.profile_image}
                                    status={pet.status}
                                    listed={pet.listed}
                                    name={pet.name}
                                    shelter={pet.shelter}
                                    animal={pet.animal}
                                    birthday={pet.birthday}
                                    description={pet.description}
                                />
                            )
                        })
                    }
                {adoptedPets.length == 0 && <span>Nothing to see here</span>}
              </div>
    
          </div>

          </div>
            </div>
        }
        </>
    )
}
export default ShelterProfilePage