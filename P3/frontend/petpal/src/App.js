import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import TestPage from './pages/LoginAndRegister/test';
import LoginPage from './pages/LoginAndRegister/login_page';
import LandingPage from './pages/LoginAndRegister/landing_page';
import RegisterPageShelter from './pages/LoginAndRegister/register_page_shelter';
import RegisterPageSeeker from './pages/LoginAndRegister/register_page_seeker';
import Search from './pages/Search/Search';

import TestHomePage from './pages/LoginAndRegister/test_home_page';
import ListPet from './pages/application/list_pet';

import "bootstrap/dist/css/bootstrap.min.css";
import PetDetail from './pages/pet/petDetail';
import CreateApplication from './pages/application/create_application';
import SeekerProfileSeekerView from './pages/accounts/seeker_profile_seekerview';

import { UserProvider } from './contexts/UserContext';


function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" >
              <Route index  element={<LandingPage/>}/>
              <Route path="login/" element={<LoginPage/>}/>
              <Route path="test/:shelter_id/" element={<TestPage/>}/>
              <Route path="testhome/" element={<TestHomePage/>}/>
              <Route path="pets/pet/:id" element={<PetDetail />} />
              <Route path="accounts/seekers/:id" element={<SeekerProfileSeekerView />} />
              <Route path="register/">
                <Route path="seeker/" element={<RegisterPageSeeker/>}/>
                <Route path="shelter/" element={<RegisterPageShelter/>}/>
              </Route>
              <Route path="search/" element={<Search/>}/>
              <Route path='shelter/pet/' element={<ListPet />}/>
            <Route path='/pets/:petId/applications/' element={<CreateApplication />}/>
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
