import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import  axios  from 'axios';
import PetCard from '../../components/PetCard';
import ApplicationComments from '../../common/Comments/application_comments'
import '../../common/styles.css';

export default function SeekerApplication() {
    const [pet, setPet] = useState(null);
    const [application, setApplication] = useState(null);
    const [statusError, setStatusError] = useState('');

    const { id } = useParams();

    const navigate = useNavigate();
    const bearerToken = localStorage.getItem('access_token');

    const getApplication = async (app_id) => {
        const base_url ='http://127.0.0.1:8000/'
        try {
            const res = await axios.get(
                `${base_url}pets/application/${app_id}/`,
                {
                    headers: { Authorization: `Bearer ${bearerToken}`, }
                }
            )
            console.log(res);
            setApplication(res.data);
        } catch (err) {
            if (err.response.status === 403) {
                // TODO: naviagte somewhere else
                navigate('/testHome/');
            }
            console.log(err);
        }
    }

    const getPet = async (pet_id) => {
        const base_url ='http://127.0.0.1:8000/'
        try {
            const res = await axios.get(
                `${base_url}pets/pet/${pet_id}/`,
                {
                    headers: { Authorization: `Bearer ${bearerToken}`, }
                }
            )

            console.log(res);
            setPet(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    // get pet
    useEffect(() => {
        if (application) {
            getPet(application.pet);
        }
    }, [application])

    // get application
    useEffect(() => {
        getApplication(id);
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const base_url ='http://127.0.0.1:8000/'
        const formData = new FormData();
        formData.append('status', 'withdrawn');

        try {
            const res = await axios.patch(
                `${base_url}pets/application/${id}/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${bearerToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
            console.log(res);
            navigate('/testHome/');

        } catch (err) {
            console.log(err)
            const { data } = err.response;
            setStatusError(data.error ? data.error : '');
        }
    }

    return (
        <div className="page-container">
        <main className="container">
        <h3 className="mt-5 fw-bold">View Your Application</h3>
        <div className="row mt-5">
            {/* form */}
            <div className="col-md-6 col-12">
            {/* TODO: make name change based on which application */}
            {/* TODO: add aria */}
            {/* TODO: change input to boxes with same styling */}
            <form onSubmit={handleSubmit}>
                {/* <div className="mb-3">
                <input type="text" readOnly className="form-control bg-zinc-100 text-zinc-500" id="name1" value="David David" />
                </div> */}

                {/* <div className="mb-3">
                <input type="email" readOnly className="form-control bg-zinc-100 text-zinc-500" id="floatingInput" value="david@example.com" />
                </div> */}

                {/* <div className="mb-3">
                <input type="tel" readOnly className="form-control bg-zinc-100 text-zinc-500" id="tel" 
                    value={application ? application.phone : ''} />
                </div> */}

                <div className="mb-3">
                <select name="contactMethod" className="form-select bg-zinc-100 text-zinc-500" id="contactMethod" disabled>
                    <option >{application ? `Prefers to be contacted by ${application.preferred_contact}` : ''}</option>
                </select>
                </div>

                <div className="mb-3">
                <textarea name="reason" id="reason" className="form-control bg-zinc-100 text-zinc-500" readOnly style={{ height: '215px' }} 
                    value={application? application.description : ''}>
                </textarea>
                </div>

                <button className="primary-button mb-md-0 mb-3" style={{ backgroundColor: 'crimson' }} >
                Withdraw application
                </button>
                { statusError && <div className="text-danger mb-3 mt-n3">{statusError}</div>}
            </form>

            {/* Chat section */}
            <ApplicationComments />
            </div>

            {/* Card */}
            <div className="col-md-6 col-12 mt-md-0 mt-3 mb-3 d-flex justify-content-center align-items-start">
            { pet && <PetCard 
                image={pet.profile_image}
                status={pet.status}
                listed={pet.listed}
                name={pet.name}
                // TODO: get shelter
                shelter={pet.shelter}
                animal={pet.animal}
                birthday={pet.birthday}
                description={pet.description}
                // style={{ transform: 'scale(1.3)' }}
            />
            }
            </div>
        </div>
        </main>
        </div>
    )
}
