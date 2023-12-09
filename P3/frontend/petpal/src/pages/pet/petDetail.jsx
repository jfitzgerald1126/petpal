import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../common/styles.css';
import PetCard from '../../components/PetCard';
import { useUserContext } from '../../contexts/UserContext';
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link';


function PetDetail(){
        const [pet, setPet] = useState(null);
        const [shelter, setShelter] = useState(null);
        const [petListData, setPetListData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [isOwner, setIsOwner] = useState(false);
        const [error, setError] = useState(null);
        const { id } = useParams();
        const { user } = useUserContext();
        const authToken = localStorage.getItem('access_token');
        const navigate = useNavigate();

        useEffect(() => {
            setLoading(true);
            setError(false);
            axios.get(`http://localhost:8000/pets/pet/${id}/`, 
            {
                headers: { Authorization: `Bearer ${authToken}` }
            })
            .then(response => {
                setPet(response.data);
                return axios.get(`http://localhost:8000/accounts/shelters/${response.data.shelter}/`, 
                {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
            })
            .then(response => {
                setShelter(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(true);
                setLoading(false);
                console.error('There was an error!', error);
            });
        }, [id, authToken]);
    
        useEffect(() => {
            if (pet?.shelter) {
                axios.get('http://127.0.0.1:8000/pets/pets/?shelter=' + pet.shelter, 
                {
                    headers: { Authorization: `Bearer ${authToken}` }
                })
                .then(response => {
                    setPetListData(response.data);
                })
                .catch(error => {
                    setError(true);
                    console.error('There was an error!', error);
                });
            }
        }, [authToken, pet]); 
        
        useEffect(() => {
            if (!loading && user?.type === "shelter" && pet) {
                setIsOwner(user.shelter.id === pet.shelter);
            } else {  
                setIsOwner(false);
            }
        }, [user, pet, shelter, loading]);

        const handleDeletePet = () => {
            if (window.confirm('Are you sure you want to delete this pet listing?')) {
                axios.delete(`http://localhost:8000/pets/pet/${id}/`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                })
                .then(() => {
                    navigate('/profile/');
                })
                .catch(error => {
                    console.error('Error deleting pet', error);
                });
            }
        };

        if (loading) {
            return <div>Loading...</div>;
        }
        if (error) {
            return <div>Error occurred!</div>;
        }
        if (!isOwner){
            return (
            <div className="page-container">
                <div className="content-container d-flex flex-column align-items-center">
                <div className="pet-container d-flex">
        
                <div className="pet-images-container d-flex flex-column align-items-end">
                <div className="pet-cover-image"> <img src={pet.profile_image} alt={pet.name}/> </div>
                </div>
                
        
                <div className="pet-details-container d-flex flex-column align-items-start">
                <div className="pet-info-container d-flex flex-row">
                  <h1 className="text-zinc-700 fs-3 fw-bold">{pet.name}</h1>
                  {pet.status == 'available' && user.type == "seeker" && 
                    
                    <Link to={`apply`}>
                        <button 
                        className={`primary-button ${pet.status}`}
                        style={{marginLeft:20}}
                        disabled={pet.status !== 'available'}
                    >
                        Apply
                    </button>
                    </Link>
                  }
                  {pet.status != 'available' && 
                        <button 
                        className={`primary-button ${pet.status}`}
                        style={{marginLeft:20}}
                        disabled={pet.status !== 'available'}
                        >
                            {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
                        </button>
                    }
                    </div>
                
                <div className="pet-info-container d-flex flex-row">
                  <div className="pet-icon-list d-flex flex-column pe-5">
                    <span className="text-zinc-400 fs-8"><i className="bi bi-house"></i>
                    <Link to={`/shelter/${shelter.id}`}>
                        <a className="shelter-link-text">{shelter.shelter_name}</a>
                    </Link>
                    </span>
                    {pet.breed && <span className="text-zinc-400 fs-8"><i className="bi bi-chat-square-heart"></i>{pet.breed}</span>}
                    {pet.birthday && <span className="text-zinc-400 fs-8"><i className="bi bi-cake"></i> {pet.birthday}</span>}
                  </div>
                  <div className="d-flex flex-column">
                  <span className="text-zinc-400 fs-8"><i className="bi bi-piggy-bank"></i>{pet.animal}</span>
                    {pet.caretaker && <span className="text-zinc-400 fs-8"> <i className="bi bi-person"></i> {pet.caretaker}</span>}
                  </div>
                </div>
                <p className="text-zinc-600 fs-8 mt-4">Description: {pet.description}</p>
                {pet.vaccine_status && <p className="text-zinc-600 fs-8 mt-0">Vaccine Status: {pet.vaccine_status}</p>}
                <div className="pet-info-container d-flex flex-row">
                <div className="d-flex flex-column pe-5">
                  <span className="text-zinc-400 fs-8"><i className="bi bi-envelope"></i> {shelter.email}</span>
                  <span className="text-zinc-400 fs-8"> <i className="bi bi-geo-alt"></i> {shelter.address}</span>
                  {shelter.phone_number && <span className="text-zinc-400 fs-8"> <i className="bi bi-telephone-inbound"></i> {shelter.phone_number}</span>}
                </div>
                
              </div>
              </div>
              
              
              </div>
              <div className="our-friends-container w-100 px-5 mt-3 d-flex flex-column align-items-start">
              <h1 className="text-zinc-700 fs-3 fw-bold">Our Friends</h1>
               {/* <!-- PET CARDS --> */}
               <div className='listing-card-grid-container'>
                    {!loading && error && "ERROR OCCURED"}
                    {!loading && petListData && petListData.results.length > 0 &&
                        <>
                        <div className="listing-card-grid">
                            {petListData.results.length == 0 && 
                                <div>NO RESULTS FOUND</div>
                            }
                            {petListData.results?.map((pet) => {
                                    return (
                                        <PetCard 
                                        id={pet.id}
                                            image={pet.profile_image}
                                            status={pet.status}
                                            listed={pet.listed}
                                            name={pet.name}
                                            shelter="Annex Dog Rescue"
                                            animal={pet.animal}
                                            birthday={pet.birthday}
                                            description={pet.description}
                                        />
                                    )
                                })
                            }
                        </div>
                        </>
                    }
                </div>
                </div>
              </div>
              </div>
            );
        }
        else {
            {/* shelter view of pet*/}
            return (
                <div className="page-container">
                <div class="content-container d-flex flex-column align-items-center">
    <div class="pet-container d-flex">
      <div class="pet-images-container d-flex flex-column align-items-end">
        <div class="pet-cover-image"> <img src={pet.profile_image ? pet.profile_image : 'https://i.ibb.co/cbb4bJg/dog.png'}/> </div>
      </div>
      <div class="pet-details-container d-flex flex-column align-items-start">
        <div class="pet-info-container d-flex flex-row">
          <h1 class="text-zinc-700 fs-3 fw-bold">{pet.name}</h1>
            {pet.status == "withdrawn" &&            
                <button className="primary-button mb-md-0 mb-3 ml-3" style={{ marginLeft:20, backgroundColor: 'crimson', height:35,}} >
                    {pet.status}
                </button>
            }
            {pet.status != "withdrawn" &&            
                <button className="primary-button mb-md-0 mb-3 ml-3" style={{ marginLeft:20, height:35,}} >
                    {pet.status}
                </button>
            }
            {/* <HashLink to="/profile#applications"><button class="view-app-button">View Applications</button></HashLink> */}
        </div>
        
        <div className="pet-info-container d-flex flex-row">
                  <div className="pet-icon-list d-flex flex-column pe-5">
                    <span className="text-zinc-400 fs-8"><i className="bi bi-house"></i>
                    <Link to={`/shelter/${shelter.id}`}>
                        <a className="shelter-link-text">{shelter.shelter_name}</a>
                    </Link>
                    </span>
                    {pet.breed && <span className="text-zinc-400 fs-8"><i className="bi bi-chat-square-heart"></i>{pet.breed}</span>}
                    {pet.birthday && <span className="text-zinc-400 fs-8"><i className="bi bi-cake"></i> {pet.birthday}</span>}
                  </div>
                  <div className="d-flex flex-column">
                  <span className="text-zinc-400 fs-8"><i className="bi bi-piggy-bank"></i>{pet.animal}</span>
                    {pet.caretaker && <span className="text-zinc-400 fs-8"> <i className="bi bi-person"></i> {pet.caretaker}</span>}
                  </div>
                </div>
                <p className="text-zinc-600 fs-8 mt-4">Description: {pet.description}</p>
                {pet.vaccine_status && <p className="text-zinc-600 fs-8 mt-0">Vaccine Status: {pet.vaccine_status}</p>}
        <div class="pet-info-container d-flex flex-row">
        <div class="d-flex flex-column pe-5">
          <span class="text-zinc-400 fs-8"><i class="bi bi-envelope"></i> {shelter.email}</span>
          <span class="text-zinc-400 fs-8"> <i class="bi bi-geo-alt"></i> {shelter.address}</span>
          {shelter.phone_number && <span class="text-zinc-400 fs-8"> <i class="bi bi-telephone-inbound"></i> {shelter.phone_number}</span>}
        </div>
      </div>
      </div>
    </div>
    <div className="pet-info-container d-flex flex-row">
    <Link to={`edit`}><button class="edit-listing-button">Edit Listing</button></Link>
    <button className="delete-listing-button" onClick={handleDeletePet}>Delete Listing</button>
  </div>
  </div>
  </div>
            
            
                );
    }
}


export default PetDetail;