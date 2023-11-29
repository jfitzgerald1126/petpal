import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

// import TestPage from './pages/LoginAndRegister/test';
import LoginPage from './pages/LoginAndRegister/login_page';
import LandingPage from './pages/LoginAndRegister/landing_page';
import "bootstrap/dist/css/bootstrap.min.css";

function WebpageRouter(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" >
            <Route index  element={<LandingPage/>}/>
            <Route path="login" element={<LoginPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
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
