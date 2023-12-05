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

import "bootstrap/dist/css/bootstrap.min.css";
import PetDetail from './pages/pet/petDetail';
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
              <Route path="/pet/:id" element={<PetDetail />} />
              <Route path="register/">
                <Route path="seeker/" element={<RegisterPageSeeker/>}/>
                <Route path="shelter/" element={<RegisterPageShelter/>}/>
              </Route>
              <Route path="search/" element={<Search/>}/>
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
