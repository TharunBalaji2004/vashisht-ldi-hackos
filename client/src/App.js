import "./App.css";
import Home from "./Home";
import React from 'react';
import AssignRoles from "./Roles";
import AddProd from "./AddProd";
import Supply from "./Supply";
import Track from "./Track";
import TrazLogo from "./images/traz_logo.png"
import DigitalIndia from "./images/digital_india.png"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/roles" exact element={<AssignRoles />} />
            <Route path="/addprod" exact element={<AddProd />} />
            <Route path="/supply" exact element={<Supply />} />
            <Route path="/track" exact element={<Track />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

const Navbar = () => {
  return (
     <div className='navbar'> 
            <div className='logo'>
              <img src={TrazLogo} alt="logo"/>
              <h3 style={{"fontWeight": "bold"}}>X</h3>
              <img src={DigitalIndia} alt="logo" />
            </div>
            <div className='nav-links'>
                <Link to="/">
                  Home
                </Link>
                <Link to="/roles">
                  Roles
                </Link>
                <Link to="/addprod">
                  Add Product
                </Link>
                <Link to="/supply">
                  Supply
                </Link>
                <Link to="/track">
                  Track
                </Link>
            </div>
        </div>
  )
}

export default App;