// import React from 'react'
// import { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import  axios  from 'axios';
// import PetCard from '../../components/PetCard';
// import ApplicationComments from '../../common/Comments/application_comments'
// import '../../common/styles.css';

// export default function ShelterApplication() {
//     const [pet, setPet] = useState(null);
//     const [application, setApplication] = useState(null);
//     const [seeker, setSeeker] = useState(null);
//     const [statusError, setStatusError] = useState('');

//     const { id } = useParams();

//     const navigate = useNavigate();

//     const getApplication = async (app_id) => {
//         const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxOTEyMzA2LCJpYXQiOjE3MDE4MjU5MDYsImp0aSI6IjFjYzZlZDA3NTc2YzQzNjI5YzZhNDI1ZDhiOGZkMzk2IiwidXNlcl9pZCI6Mn0.TXPQ8OHHsteJIRzkfvt2-DjtblC5GSYhGu3GhoTXNDw';
//         const base_url ='http://127.0.0.1:8000/'
//         try {
//             const res = await axios.get(
//                 `${base_url}pets/application/${app_id}/`,
//                 {
//                     headers: { Authorization: `Bearer ${bearerToken}`, }
//                 }
//             )
//             console.log(res);
//             setApplication(res.data);
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     const getPet = async (pet_id) => {
//         const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxOTA5NzQ2LCJpYXQiOjE3MDE4MjMzNDYsImp0aSI6ImE3NDIyZGI0OTYyNTRhMzE5YWJiYTViNmE1Nzg3OWEwIiwidXNlcl9pZCI6Mn0.w3Re23_Ka7tAFX_yzVNoVMkwzWwJ3MGV71SY0_bfzvw';
//         const base_url ='http://127.0.0.1:8000/'
//         try {
//             const res = await axios.get(
//                 `${base_url}pets/pet/${pet_id}/`,
//                 {
//                     headers: { Authorization: `Bearer ${bearerToken}`, }
//                 }
//             )

//             console.log(res);
//             setPet(res.data);
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     const getSeeker = async (seeker_id) => {
//         const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxOTA5NzQ2LCJpYXQiOjE3MDE4MjMzNDYsImp0aSI6ImE3NDIyZGI0OTYyNTRhMzE5YWJiYTViNmE1Nzg3OWEwIiwidXNlcl9pZCI6Mn0.w3Re23_Ka7tAFX_yzVNoVMkwzWwJ3MGV71SY0_bfzvw';
//         const base_url ='http://127.0.0.1:8000/'
//         try {
//             const res = await axios.get(
//                 `${base_url}pets/pet/${pet_id}/`,
//                 {
//                     headers: { Authorization: `Bearer ${bearerToken}`, }
//                 }
//             )

//             console.log(res);
//             setPet(res.data);
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     // get pet
//     useEffect(() => {
//         if (application) {
//             getPet(application.pet);
//         }
//     }, [application])

//     // get application
//     useEffect(() => {
//         getApplication(id);
//     }, [])

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const base_url ='http://127.0.0.1:8000/'
//         const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxOTEyMzA2LCJpYXQiOjE3MDE4MjU5MDYsImp0aSI6IjFjYzZlZDA3NTc2YzQzNjI5YzZhNDI1ZDhiOGZkMzk2IiwidXNlcl9pZCI6Mn0.TXPQ8OHHsteJIRzkfvt2-DjtblC5GSYhGu3GhoTXNDw'
//         const formData = new FormData();
//         formData.append('status', 'withdrawn');

//         try {
//             const res = await axios.patch(
//                 `${base_url}pets/application/${id}/`,
//                 formData,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${bearerToken}`,
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 }
//             )
//             console.log(res);
//             navigate('/testHome/');

//         } catch (err) {
//             console.log(err)
//             const { data } = err.response;
//             setStatusError(data.error ? data.error : '');
//         }
//     }

//     return (
//         <main className="container" style={{ marginTop: '150px' }}>
//         <h3 className="mt-5 fw-bold">View Your Application</h3>
//         <div className="row mt-5">
//             {/* form */}
//             <div className="col-md-6 col-12">
//             {/* TODO: make name change based on which application */}
//             {/* TODO: add aria */}
//             {/* TODO: change input to boxes with same styling */}
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                 <input type="text" readOnly className="form-control bg-zinc-100 text-zinc-500" id="name1" value="David David" />
//                 </div>

//                 {/* <div className="mb-3">
//                 <input type="email" readOnly className="form-control bg-zinc-100 text-zinc-500" id="floatingInput" value="david@example.com" />
//                 </div> */}

//                 {/* <div className="mb-3">
//                 <input type="tel" readOnly className="form-control bg-zinc-100 text-zinc-500" id="tel" 
//                     value={application ? application.phone : ''} />
//                 </div> */}

//                 <div className="mb-3">
//                 <select name="contactMethod" className="form-select bg-zinc-100 text-zinc-500" id="contactMethod" disabled>
//                     <option >{application ? `Prefers to be contacted by ${application.preferred_contact}` : ''}</option>
//                 </select>
//                 </div>

//                 <div className="mb-3">
//                 <textarea name="reason" id="reason" className="form-control bg-zinc-100 text-zinc-500" readOnly style={{ height: '215px' }} 
//                     value={application? application.description : ''}>
//                 </textarea>
//                 </div>

//                 <button className="primary-button mb-md-0 mb-3" style={{ backgroundColor: 'crimson' }} >
//                 Withdraw application
//                 </button>
//                 { statusError && <div className="text-danger mb-3 mt-n3">{statusError}</div>}
//             </form>

//             {/* Chat section */}
//             <ApplicationComments />
//             </div>

//             {/* Card */}
//             <div className="col-md-6 col-12 mt-md-0 mt-3 mb-3 d-flex justify-content-center align-items-start">
//             { pet && <PetCard 
//                 image={pet.profile_image}
//                 status={pet.status}
//                 listed={pet.listed}
//                 name={pet.name}
//                 // TODO: get shelter
//                 shelter={pet.shelter}
//                 animal={pet.animal}
//                 birthday={pet.birthday}
//                 description={pet.description}
//                 // style={{ transform: 'scale(1.3)' }}
//             />
//             }
//             </div>
//         </div>
//         </main>
//     )
// }