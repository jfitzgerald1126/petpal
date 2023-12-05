import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PetDetailComponent = () => {
    const [pet, setPet] = useState(null);
    const { id } = useParams();
    console.log("pet got here")
    useEffect(() => {
        axios.get(`http://localhost:8000/pets/pet/${id}`)
            .then(response => {
                setPet(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the pet details!', error);
            });
    }, [id]);

    if (!pet) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{pet.name}</h1>
            <p>{pet.description}</p>
            <p>{pet.animal}</p>
            <p>{pet.birthday}</p>
        </div>
    );
}

export default PetDetailComponent;