import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar/Navbar.jsx';
import Signup from './pages/Signup/Signup.jsx';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';

import ToggleBtn from './Components/Navbar/ToggleBtn.jsx';

function App() {
  const [user, setUser] = useState({});
  const [thememode, setThememode] = useState(localStorage.getItem('theme') || 'light');

  // Function to toggle between light and dark mode
  const toggle = () => {
    const newTheme = thememode === 'light' ? 'dark' : 'light';
    setThememode(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.querySelector('html').classList.remove('light', 'dark');
    document.querySelector('html').classList.add(thememode);
  }, [thememode]);

  // Function to get user data from local storage
  useEffect(() => {
    const check = async () => {
      try {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
          const foundUser = JSON.parse(loggedInUser);
          await setUser(foundUser);
        }
      } catch (err) {
        console.log(err);
      }
    };
    check();
  }, [user._id]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar user={user} thememode={thememode} toggle={toggle} setUser={setUser} />} />
          <Route path="/login" element={<Login user={user} setUser={setUser}thememode={thememode} toggle={toggle}/>} />
          <Route path="/signup" element={<Signup user={user} setUser={setUser}thememode={thememode} toggle={toggle}/>} />
          <Route path="/navbar" element={<Navbar user={user} thememode={thememode} toggle={toggle} setUser={setUser}/>} />
          <Route path="/dashboard" element={<Dashboard user={user}thememode={thememode} toggle={toggle} setUser={setUser}/>} />
        <Route path="/btn" element={<ToggleBtn thememode={thememode} toggle={toggle} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
