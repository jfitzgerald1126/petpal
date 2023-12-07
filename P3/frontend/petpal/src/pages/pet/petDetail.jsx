import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../common/styles.css';
import PetCard from '../../components/PetCard';

function PetDetail(){
        const [pet, setPet] = useState(null);
        const [shelter, setShelter] = useState(null);
        const [petListData, setPetListData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const { id } = useParams();
        const authToken = localStorage.getItem('access_token');
    
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
            axios.get('http://127.0.0.1:8000/pets/pets/', 
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
        }, [authToken]); // Fetch pet list data once on mount
    
        if (loading) {
            return <div>Loading...</div>;
        }
        if (error) {
            return <div>Error occurred!</div>;
        }
        return (
            <div class="content-container d-flex flex-column align-items-center">
            <div className="pet-container d-flex">
    
            <div className="pet-images-container d-flex flex-column align-items-end">
            <div className="pet-cover-image"> <img src={pet.profile_image} alt={pet.name}/> </div>
            {/* PUT CAROSUEL HERE*/}
            </div>
            
    
            <div className="pet-details-container d-flex flex-column align-items-start">
            <div className="pet-info-container d-flex flex-row">
              <h1 className="text-zinc-700 fs-3 fw-bold">{pet.name}</h1>
            <a href="pet_adoption_page.html"><button className="pet-adopt-button">Adopt Now!</button></a>
            </div>
            
            <div className="pet-info-container d-flex flex-row">
              <div className="pet-icon-list d-flex flex-column pe-5">
                <span className="text-zinc-400 fs-8"><i className="bi bi-house"></i> <a href="shelter_detail_page.html" className="shelter-link-text"> House</a></span>
                <span className="text-zinc-400 fs-8"><i className="bi bi-chat-square-heart"></i> {pet.breed}</span>
                <span className="text-zinc-400 fs-8"><i className="bi bi-cake"></i> {pet.birthday}</span>
              </div>
              <div className="d-flex flex-column">
                <span className="text-zinc-400 fs-8"> <i className="bi bi-person"></i> {pet.caretaker}</span>
                <span className="text-zinc-400 fs-8"> <i className="bi bi-clipboard2-pulse"></i> View Vaccination Record</span>
              </div>
            </div>
            <p className="text-zinc-600 fs-8 mt-4">{pet.description}</p>
            <div className="pet-info-container d-flex flex-row">
            <div className="d-flex flex-column pe-5">
              <span className="text-zinc-400 fs-8"><i className="bi bi-envelope"></i> {shelter.email}</span>
              <span className="text-zinc-400 fs-8"> <i className="bi bi-geo-alt"></i> {shelter.address}</span>
              <span className="text-zinc-400 fs-8"> <i className="bi bi-telephone-inbound"></i> {shelter.phone_number}</span>
            </div>
            
          </div>
          </div>
          
          
          </div>
          <div class="our-friends-container w-100 px-5 mt-3 d-flex flex-column align-items-start">
          <h1 class="text-zinc-700 fs-3 fw-bold">Our Friends</h1>
           {/* <!-- PET CARDS --> */}
           <div className='listing-card-grid-container'>
                {!loading && error && "ERROR OCCURED"}
                {!loading && petListData && 
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
        );
    }


export default PetDetail;