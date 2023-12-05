import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import TestPage from './pages/LoginAndRegister/test';
import LoginPage from './pages/LoginAndRegister/login_page';
import LandingPage from './pages/LoginAndRegister/landing_page';
import RegisterPageShelter from './pages/LoginAndRegister/register_page_shelter';
import RegisterPageSeeker from './pages/LoginAndRegister/register_page_seeker';
import TestHomePage from './pages/LoginAndRegister/test_home_page';

import "bootstrap/dist/css/bootstrap.min.css";
import PetDetail from './pages/pet/petDetail';



function WebpageRouter(){
  return(
    <Router>
      <Routes>
        <Route path="/" >
            <Route index  element={<LandingPage/>}/>
            <Route path="login/" element={<LoginPage/>}/>
            <Route path="test/:shelter_id/" element={<TestPage/>}/>
            <Route path="testhome/" element={<TestHomePage/>}/>
            <Route path="/pet/:id" element={<PetDetail />} />
            <Route path="register/">
              <Route path="seeker/" element={<RegisterPageSeeker/>}/>
              <Route path="shelter/" element={<RegisterPageShelter/>}/>
            </Route>

        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <WebpageRouter/>
  );
}

export default App;
