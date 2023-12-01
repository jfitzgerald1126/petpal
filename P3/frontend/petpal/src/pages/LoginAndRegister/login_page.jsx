
import '../../common/styles.css'
import { Link } from 'react-router-dom'

function LoginPage(){
    return <>
        {/* <div className="content-container d-flex align-items-center flex-row"> */}
        <div className="super-wrapper w-100 h-100 d-flex align-items-center justify-content-center">
            <div className="login-wrapper d-flex flex-column align-items-left mb-5  h-100">
                <div className="login-header text-left ">
                    <h4 className="fw-light">Welcome Back User</h4>
                    <p className="display-4 fw-medium">Login to your account</p>
                    {/* <h4 className="fw-light">Dont't have an account ? <a href="index.html" className="landinglink">Register</a></h4> */}
                    <h4 className="fw-light">Dont't have an account ? <Link to="/" className="landinglink">Register</Link></h4>
                    {/* <!--for now our landing page serves as the way to either register as a user or shelter--> */}
                </div>


                <div className="w-75">
                    <form method="post">

                    {/* <!--used form-control configurations from boostrap to align input boxes
                    https://getbootstrap.com/docs/5.3/forms/overview/#overview , https://getbootstrap.com/docs/5.3/forms/form-control/
                    --> */}
                    <div className="mb-3 mt-5">
                        <input type="email" className="form-control" id="email" name="email"placeholder="Email..."/>
                    </div>
                    <div className="mb-3">
                        <input type="password" className="form-control" id="password" name="password" placeholder="Password..."/>
                    </div>
                    {/* <!--note, form control classNamees are default configs provided by bootstrap--> */}
                    <div className="mb-3 d-flex justify-content-start">
                        <button type="submit" className="login-button"><a href="login_page_fail.html" className="link">Login</a></button>
                    </div>
                    {/* <!--for now this is meant to go to the fail page as we dont have the tools
                    to make it actually see if the password is correct or not-->
                    <!--once we have functionality to actually pass around views, ill take out the anchor tags--> */}
                    
                    </form>
                </div>

            </div>
        </div>
        {/* </div> */}
    </>;



}


export default LoginPage

// group_3772\P3\frontend\petpal\src\common\styles.css