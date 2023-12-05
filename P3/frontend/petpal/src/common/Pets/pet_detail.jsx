import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';


const PetDetailComponent = () => {
    const [pet, setPet] = useState(null);
    const [shelter, setShelter] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:8000/pets/pet/${id}/`)
            .then(response => {
                setPet(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the pet details!', error);
            });
    }, [id]);

    useEffect(() => {
        if (pet && pet.shelter) {
            axios.get(`http://localhost:8000/accounts/shelters/${pet.shelter}/`)
                .then(response => {
                    setShelter(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the shelter details!', error);
                });
        }
    }, [pet]);

    if (!pet || !shelter) {
        return <div>Loading...</div>;
    }

    return (
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
    );
}

export default PetDetailComponent;