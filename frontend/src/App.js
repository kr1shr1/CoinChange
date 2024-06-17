import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar/Navbar.jsx';
import Signup from './pages/Signup/Signup.jsx';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Dues from './pages/Dues/Dues.jsx';
import Savings2 from './pages/Savings/Savings2.jsx';
import Main from './pages/Groups/Main.jsx';
import SimplifyDebt from './pages/Groups/SimplifyDebt.jsx';
import Grouphome from './pages/Groups/Grouphome.jsx';
import Inbox from './pages/inbox/inbox.jsx';
import Profile from './pages/Profile/Profile.jsx'; 

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [groupData, setgroupData] = useState([]);

  // Update localStorage when user state changes
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard user={user} setUser={setUser}/>} />
        <Route path="/login" element={<Login user={user} setUser={setUser}/>} />
        <Route path="/signup" element={<Signup user={user} setUser={setUser}/>} />
        <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser}/>} />
        <Route path="/dues" element={<Dues user={user}/>} />
        <Route path="/savings" element={<Savings2 user={user} />} />
        {/* <Route path="/transcard" element={<TransactionCard />} /> */}
        <Route path="/groups" element={<Main user={user}/>} />
        {/* <Route path="/billsplit/:id" element={<Grouphome user={user}/>} /> */}
        <Route path="/simplifydebt/:id" element={<SimplifyDebt user={user}/>} /> 
        {/* <Route path="/btn" element={<ToggleBtn />} /> */}
        {/* <Route path="/save" element={<Savings2 user={user}/>} /> */}
        <Route path="/profile" element={<Profile user={user} setUser={setUser}/>} />
        <Route path="/billsplit" element={<Grouphome user={user}/>} />
        <Route path="/inbox" element={<Inbox user={user} setUser={setUser}/>} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
