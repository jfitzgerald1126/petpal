import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import  axios  from 'axios';
import '../../common/styles.css';
import PetCard from '../../components/PetCard';

export default function CreateApplication() {
    // const [name, setName] = useState('');
    const [contact, setContact] = useState('')
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [contactError, setContactError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    const [pet, setPet] = useState(null);

    const { petId } = useParams();

    const navigate = useNavigate();

    const getPet = async (pet_id) => {
        const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxOTA5NzQ2LCJpYXQiOjE3MDE4MjMzNDYsImp0aSI6ImE3NDIyZGI0OTYyNTRhMzE5YWJiYTViNmE1Nzg3OWEwIiwidXNlcl9pZCI6Mn0.w3Re23_Ka7tAFX_yzVNoVMkwzWwJ3MGV71SY0_bfzvw';
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
        getPet(petId);
    }, [])

    const handleSubmit = async (e) => {
        // for custom form logic
        // https://stackoverflow.com/questions/39809943/react-preventing-form-submission
        e.preventDefault();
        // TODO: get bearer token from state
        const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxOTA1NzY2LCJpYXQiOjE3MDE4MTkzNjYsImp0aSI6IjMyYWVhNmM0M2E0YjQ3MGFhZDFkOWFhMmEzYzRlM2Y5IiwidXNlcl9pZCI6Mn0.8KFjlptN4R5pG3TE2O3tncPQ1NIANWEbtXHJ4UAsH-c'
    

        const formData = new FormData();
        formData.append('preferred_contact', contact);
        formData.append('description', description);

        const base_url ='http://127.0.0.1:8000/'
        try {
            const res = await axios.post(
                `${base_url}pets/${petId}/applications/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${bearerToken}`,
                        'Content-Type': 'multipart/form-data',
                      },
                }
            )
            console.log(res.data);
            navigate('/testHome/');
        } catch (err) {
            console.log(err)
            const { data } = err.response;
            setContactError(data.preferred_contact ? data.preferred_contact[0] : '');
            setDescriptionError(data.description ? data.description[0] : '');
            setErrorMessage(data.error ? data.error : '');
        }
    }

    return (
    <main className="container" style={{ marginTop: '100px' }}>
        <h3 className="mt-5 fw-bold">Submit An Adoption Application</h3>
            <div className="row mt-5 ">
            {/* <!-- form --> */}
            <div className="col-md-6 col-12">
            <form onSubmit={handleSubmit} >
                {/* <div className="mb-3">
                <input 
                    type="text" 
                    className="form-control bg-zinc-100 text-zinc-500" 
                    id="name" 
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}    
                />
                </div> */}

                {/* <div className="mb-3">
                <input 
                    type="email" 
                    className="form-control bg-zinc-100 text-zinc-500" 
                    id="floatingInput" 
                    placeholder="Email"
                    onChange={}
                />
                </div> */}
{/* 
                <div className="mb-3">
                <input type="tel" className="form-control bg-zinc-100 text-zinc-500" id="tel" placeholder="Phone" />
                </div> */}

                <div className="mb-3">
                <select 
                    name="contactMethod" 
                    className="form-select bg-zinc-100 text-zinc-500" 
                    id="contactMethod"
                    onChange={(e) => setContact(e.target.value)}    
                    defaultValue={''}
                    >
                    <option value="" disabled>Preferred contact method</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                </select>
                </div>
                { contactError && <div className="text-danger mb-3 mt-n3">{contactError}</div>}

                <div className="mb-3">
                <textarea 
                    name="reason" 
                    id="reason" 
                    className="form-control bg-zinc-100 text-zinc-500" 
                    placeholder={`Why do you want to adopt ${pet ? pet.name : 'this pet'}?`}
                    style={{ height: '215px' }} 
                    onChange={(e) => setDescription(e.target.value)}    
                >    
                </textarea>
                </div>
                { descriptionError && <div className="text-danger mb-3 mt-n3">{descriptionError}</div>}

                <button type="submit" className="mb-md-0 mb-3 primary-button" >Submit Application</button>
            </form>

            { errorMessage && <div className="alert alert-warning mt-3" role="alert">
                {errorMessage}
            </div>}
            </div>

            {/* TODO: see how its used in pages/search/search */}
            {/* <!-- card --> */}
            <div className="col-md-6 col-12 mt-md-0 mt-3 mb-3 d-flex justify-content-center">
            {/* <div className="card" style={{ maxWidth: '450px' }}>
                <img src="dog.png" className="card-img-top" alt="..." />
                <div className="card-body">
                <h4 className="card-title text-start fw-bold">Ronald Mcdonald</h4>
                <h6 className="card-subtitle mb-2 text-start text-muted text-zinc-400">Listed 20/03/2023</h6>
                <div className="row">
                    <div className="col-6 text-zinc-400 ">Annex Dog Rescue</div>
                    <div className="col-6 text-zinc-400">Bob Ross</div>
                    <div className="col-6 text-zinc-400">German Shepherd</div>
                    <div className="col-6 text-zinc-400"><a href="" className="text-zinc-400">View vaccination record</a></div>
                    <div className="col-6 text-zinc-400">03/02/2023, 2 years</div>
                </div>
                <div className="card-text mt-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolores, reiciendis cupiditate? Fugiat corporis asperiores, facere aspernatur repellat voluptatem eveniet beatae pariatur iste deserunt eos soluta minus exercitationem similique sed totam rem vel atque nostrum officia amet harum vero quae voluptate! Maxime fugiat optio facilis natus eligendi nam deserunt numquam a?</div>
                </div>
            </div> */}
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
  )
}
