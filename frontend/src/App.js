import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar/Navbar.jsx';
import Signup from './pages/Signup/Signup.jsx';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Dues from './pages/Dues/Dues.jsx'
import Savings2 from './pages/Savings/Savings2.jsx'

import ToggleBtn from './Components/Navbar/ToggleBtn.jsx';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});

  const [thememode, setThememode] = useState(localStorage.getItem('theme') || 'light');

  // console.log(isLoggedIn)
  // Update localStorage when user state changes
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);


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


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar user={user} thememode={thememode} toggle={toggle} setUser={setUser} />} />
          <Route path="/login" element={<Login user={user} setUser={setUser}thememode={thememode} toggle={toggle}/>} />
          <Route path="/signup" element={<Signup user={user} setUser={setUser}thememode={thememode} toggle={toggle}/>} />
          <Route path="/navbar" element={<Navbar user={user} thememode={thememode} toggle={toggle} setUser={setUser}/>} />
          <Route path="/dashboard" element={<Dashboard user={user} thememode={thememode} toggle={toggle} setUser={setUser}/>} />
          <Route path="/dues" element={<Dues user={user} thememode={thememode} toggle={toggle}/>} />
          <Route path="/savings" element={<Savings2 user={user} thememode={thememode} toggle={toggle} />} />
          {/* <Route path="/transcard" element={<TransactionCard thememode={thememode} toggle={toggle}/>} /> */}
          {/* <Route path="/charts" element={<Chart user={user} setUser={setUser} thememode={thememode} toggle={toggle} />} /> */}
          {/* <Route path="/groups" element={<Main user={user} thememode={thememode} toggle={toggle} groupData={groupData} setgroupData={setgroupData} />} /> */}
          {/* <Route path="/billsplit/:id" element={<Grouphome user={user} thememode={thememode} toggle={toggle}/>}/> */}
          {/* <Route path="/simplifydebt/:id" element={<SimplifyDebt user={user} thememode={thememode} toggle={toggle}/>}/>
          <Route path="/btn" element={<ToggleBtn thememode={thememode} toggle={toggle}/>}/>
          <Route path="/save" element={<Savings2 user={user} thememode={thememode} toggle={toggle} />} />
          <Route path='/simplify' element={<SimplifyDebt user={user} thememode={thememode} toggle={toggle}/>}></Route>
          <Route path="/profile" element={<Profile user={user} thememode={thememode} toggle={toggle} setUser={setUser}/>} />
          <Route path="/billsplit" element={<Grouphome user={user} thememode={thememode} toggle={toggle}/>}/>
          <Route path="/inbox" element={<Inbox user={user} setUser={setUser} thememode={thememode} toggle={toggle}/>} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
