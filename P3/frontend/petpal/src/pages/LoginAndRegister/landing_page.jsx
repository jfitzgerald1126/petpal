
import '../../common/styles.css'

import { Link } from 'react-router-dom'
function LandingPage() {
    return <>
        <div class="landing-container w-100 d-flex">

            <div class="landing-page-info  h-25 d-flex flex-column align-items-center ">
                <div class="text-center">
                    <h1 class="display-3 fw-medium">Every adoption changes a life</h1>
                    <p class="h4">Here at Petpal we ensure all pets find their forever home</p>
                </div>
                <div>
                    {/* <button type="button" class="btn btn-lg  btn-success adopt-color"><a href="signup_page_seeker.html" class="link">I want to adopt</a></button> */}
                    <Link to="/register/seeker/"><button type="button" class="btn btn-lg  btn-success adopt-color">I want to adopt</button></Link>
                    <Link to="/register/shelter/"> <button type="button" class="btn btn-secondary btn-lg  shelter-color">I'm a Shelter</button></Link>
                    {/* <button type="button" class="btn btn-secondary btn-lg  shelter-color"><a href="signup_page_shelter.html" class="link">I'm a Shelter</a></button> */}
                </div>
                </div>  
                <div class="image-container h-25 d-flex justify-content-center mt-3">
                <img src="cheems.jpg" class="w-100 h-100 landing-image" />
                {/* <!-- <img src="smudge.jpg" class="w-50 position-absolute top-50 start-0 z-1 landing-image">
                <img src="sealofapproval.jpg" class="w-50 position-absolute bottom-0 end-0 z-2 landing-image"> --> */}
            </div>
        </div>
    </>
}
export default LandingPage