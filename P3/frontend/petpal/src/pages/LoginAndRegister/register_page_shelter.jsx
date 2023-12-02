import '../../common/styles.css'


import { Link } from 'react-router-dom'
import { useState } from 'react'


function RegisterPageShelter() { 
    const[username, setUsername] = useState("");
    const[email, setEmail] = useState("");
    const[shelter_name, setShelterName] = useState("");
    const[phone_number, setPhoneNumber] = useState("");
    const[address, setAddress] = useState("");
    const[password, setPassword] = useState("");
    const[confirm_password, setConfirmPassword] = useState("");

    const handleUsernameChange = (event) => {
        event.preventDefault();
        setUsername(event.target.value);
    }
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }
    const handleShelterNameChange = (event) => {
        setShelterName(event.target.value);
    }
    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    }
    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    }
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }
    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    }
    const packaged_data ={
        username: username,
        email: email,
        shelter_name: shelter_name,
        phone_number: phone_number,
        address: address,
        password: password,
        confirm_password: confirm_password
    }

    console.log(packaged_data);


    return <>
        <div className="super-wrapper w-100 h-100 d-flex align-items-center justify-content-center">
        
            <div className="login-wrapper d-flex flex-column align-items-left w-75 mb-5 h-100">
                <div className="login-header text-left ">
                    <h4 className="fw-light">Get started as a Shelter</h4>
                    <p className="display-4 fw-medium">Create a Shelter Account</p>
                    {/* <h4 className="fw-light">Already have an account ? <a href="login_page.html" className="landinglink">Log in</a></h4> */}
                    <h4 className="fw-light">Already have an account ?<Link to="/login/" className="landinglink"> Log in</Link></h4>
                    
                </div>


                <div className="w-100">
                    <form method="post">
                    {/* <!--used form-control configurations from boostrap to align input boxes
                    https://getbootstrap.com/docs/5.3/forms/overview/#overview , https://getbootstrap.com/docs/5.3/forms/form-control/
                    --> */}
                    
                    <div className="w-50">
                        <div className="mb-3 mt-5">
                            <input type="email" className="form-control" id="username" name="username" placeholder="Username..." onChange={handleUsernameChange}/>
                        </div>

                        <div className="mb-3">
                        <input type="email" className="form-control" id="email" name="email"placeholder="Email..." onChange={handleEmailChange}/>
                        </div>

                        <div className="mb-3">
                        <input type="text" className="form-control" id="shelter_name" name="shelter_name" placeholder="Shelter name..." onChange={handleShelterNameChange}/>
                        </div>

                        <div className="mb-3">
                            <input type="text" className="form-control" id="phone_number" name="phone_number" placeholder="phone number..." onChange={handlePhoneNumberChange}/>
                        </div>

                        <div className="mb-3">
                            <input type="text" className="form-control" id="address" name="address" placeholder="Address..." onChange={handleAddressChange}/>
                        </div>
                    </div>



                    <div className="w-100 d-flex mb-5">
                       
                        <div className="mb-3 w-50 me-1">
                        <input type="password" className="form-control" id="password" name="password" placeholder="Password..." onChange={handlePasswordChange}/>
                        </div>

                        <div className="mb-3 w-50">
                            <input type="password" className="form-control" id="confirm_password" name="confirm_password" placeholder="Confirm Password..." onChange={handleConfirmPasswordChange}/>
                        </div>
                    </div>
                    
            
                    <div className="mb-3 d-flex justify-content-start">
                        <button type="submit" className="login-button"><a href="signup_page_shelter_fail.html" className="link">Register</a></button>
                    </div>

                    
            
                    </form>
                </div>
            </div>
        </div>
    
    
    </>
}

export default RegisterPageShelter