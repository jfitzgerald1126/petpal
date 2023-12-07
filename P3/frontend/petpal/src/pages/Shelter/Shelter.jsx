
import { useEffect, useInsertionEffect, useMemo, useRef, useState } from 'react';
import { Link, useFetcher } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep';
import PetCard from '../../components/PetCard';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { useUserContext } from '../../contexts/UserContext';
import { useNavigate, useParams } from 'react-router-dom';

const ShelterPage = () => {

    const { id } = useParams();
    const { user } = useUserContext();
    const [shelter, setShelter] = useState(null)
    const [pets, setPets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [isOwner, setIsOwner] = useState(false)



    const fetchData = async () => {
        let url = 'http://127.0.0.1:8000/accounts/shelters/' + id

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

    const fetchPets = async () => {
        let url = 'http://127.0.0.1:8000/pets/pets/'

        const params = {
            'shelter': id,
        }

        try {
          const authToken = localStorage.getItem('access_token')
          const response = await axios.get(url, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
              params: params,
          });
          setPets(response.data.results);
        } catch (error) {
          setError(error);
        }
    }

    useEffect(() => {
        fetchData();
        fetchPets();
    }, [])

    useEffect(() => {
        console.log(shelter)
    }, [shelter])

    useEffect(() => {
        if (user?.type == "shelter") {
            setIsOwner(user.shelter.id == id)
        }
        else {
            setIsOwner(false)
        }
    }, [user])


    return (
        <>
        {!loading && 
                <div className="page-container d-flex flex-column align-items-center">
            <div className="shelter-container d-flex">
                <div className="shelter-images-container d-flex flex-column align-items-end">
                <div className="shelter-cover-image"><img src={shelter.shelter_image}/></div>
                </div>
                <div className="shelter-details-container d-flex flex-column align-items-start">
                <h1 className="text-zinc-700 fs-3 fw-bold">{shelter.shelter_name}</h1>
                <span className="mb-2">⭐⭐⭐⭐ <span className="fs-7 text-zinc-500"><u>26 reviews</u></span></span>
                <div className="shelter-info-container d-flex flex-row">
                    <div className="d-flex flex-column pe-5">
                    <span className="text-zinc-400 fs-8">{shelter.website}</span>
                    <span className="text-zinc-400 fs-8">{ `(${shelter.phone_number.slice(0, 3)})-${shelter.phone_number.slice(3, 6)}-${shelter.phone_number.slice(6)}`}</span>
                    </div>
                    <div className="d-flex flex-column">
                    <span className="text-zinc-400 fs-8">{shelter.email}</span>
                    <span className="text-zinc-400 fs-8">{shelter.address}</span>
                    </div>
                </div>
                <p className="text-zinc-600 fs-8 mt-4">{shelter.description}</p>
                </div>
            </div>
            <div className="our-friends-container w-100 px-5 mt-3 d-flex flex-column align-items-start">
                <h1 className="text-zinc-700 fs-3 fw-bold">Our Friends</h1>
                <div className="shelter-pets-container">
                    {pets?.map((pet) => {
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
                    {pets.length == 0 && <span>Looks like we have no pets right now</span>}
                </div>

            </div>
            </div>
        }
        </>
    )
}
export default ShelterPage