import '../../common/styles.css'


import { Link } from 'react-router-dom'

function RegisterPageShelter() { 





    return <>
        <div class="super-wrapper w-100 h-100 d-flex align-items-center justify-content-center">
        
            <div class="login-wrapper d-flex flex-column align-items-left w-75 mb-5 h-100">
                <div class="login-header text-left ">
                    <h4 class="fw-light">Get started as a Shelter</h4>
                    <p class="display-4 fw-medium">Create a Shelter Account</p>
                    {/* <h4 class="fw-light">Already have an account ? <a href="login_page.html" class="landinglink">Log in</a></h4> */}
                    <h4 class="fw-light">Already have an account ?<Link to="/login/" className="landinglink"> Log in</Link></h4>
                    
                </div>


                <div class="w-100">
                    <form method="post">
                    {/* <!--used form-control configurations from boostrap to align input boxes
                    https://getbootstrap.com/docs/5.3/forms/overview/#overview , https://getbootstrap.com/docs/5.3/forms/form-control/
                    --> */}
                    
                    <div class="w-50">
                        <div class="mb-3 mt-5">
                        <input type="email" class="form-control" id="email" name="email"placeholder="Email..."/>
                        </div>

                        <div class="mb-3">
                        <input type="text" class="form-control" id="shelter_name" name="shelter_name" placeholder="Shelter name..."/>
                        </div>


                        <div class="mb-3">
                        <input type="text" class="form-control" id="adress" name="adress" placeholder="Address..."/>
                        </div>
                    </div>



                    <div class="w-100 d-flex mb-5">
                       
                        <div class="mb-3 w-50 me-1">
                        <input type="password" class="form-control" id="password" name="password" placeholder="Password..."/>
                        </div>

                        <div class="mb-3 w-50">
                        <input type="password" class="form-control" id="password" name="password" placeholder="Confirm Password..."/>
                        </div>
                    </div>
                    
                

                    <div class="mb-3 d-flex justify-content-start">
                        <button type="submit" class="login-button"><a href="signup_page_shelter_fail.html" class="link">Register</a></button>
                    </div>

                    
            
                    </form>
                </div>
            </div>
        </div>
    
    
    </>
}

export default RegisterPageShelter