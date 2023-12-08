import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import TestPage from './pages/LoginAndRegister/test';
import LoginPage from './pages/LoginAndRegister/login_page';
import LandingPage from './pages/LoginAndRegister/landing_page';
import RegisterPageShelter from './pages/LoginAndRegister/register_page_shelter';
import RegisterPageSeeker from './pages/LoginAndRegister/register_page_seeker';
import Search from './pages/Search/Search';
import ShelterPage from './pages/Shelter/Shelter'
import ShelterProfile from './pages/Profile/Profile'
import Navbar from './components/navbar';

import TestHomePage from './pages/LoginAndRegister/test_home_page';
import ListPet from './pages/application/ListPet';

import "bootstrap/dist/css/bootstrap.min.css";
import PetDetail from './pages/pet/petDetail';
import CreateApplication from './pages/application/CreateApplication';
import SeekerProfile from './pages/accounts/seeker_profile';

import { UserProvider } from './contexts/UserContext';
import ViewApplication from './pages/application/ViewApplication';
import EditSeekerProfile from './pages/accounts/edit_seeker_profile';
import EditPetDetail from './pages/pet/edit_pet_profile';
import EditShelterProfile from './pages/Shelter/edit_shelter';

function App() {
  return (
    <UserProvider>
      <Router>
        <div>
          <Navbar/>
        <Routes>
          <Route path="/" >
              <Route index  element={<LandingPage/>}/>
              <Route path="login/" element={<LoginPage/>}/>
              <Route path="test/:shelter_id/" element={<TestPage/>}/>
              <Route path="testhome/" element={<TestHomePage/>}/>
              <Route path="pets/pet/:id" element={<PetDetail />} />
              <Route path="pets/pet/:id/edit" element={<EditPetDetail />} />
              <Route path="seekers/:id" element={<SeekerProfile />} />
              <Route path="seekers/:id/edit" element={<EditSeekerProfile />} />
              <Route path="register/">
                <Route path="seeker/" element={<RegisterPageSeeker/>}/>
                <Route path="shelter/" element={<RegisterPageShelter/>}/>
              </Route>
              <Route path="search/" element={<Search/>}/>
              <Route path='profile/shelter' element={<ShelterProfile />}/>
              <Route path='profile/shelter/edit' element={<EditShelterProfile />}/>
              <Route path='shelter/:id/' element={<ShelterPage />}/>
              <Route path='/pets/:petId/applications/' element={<CreateApplication />}/>
              <Route path='/pets/application/:id/' element={<ViewApplication />}/>
              {/* <Route path='/pets/application/:id/' element={<SeekerApplication />}/>
              <Route path='/pets/applicationx/:id/' element={<ShelterApplication />} /> */}
          </Route>
        </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
