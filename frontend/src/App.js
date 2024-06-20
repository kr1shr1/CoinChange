import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
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
import ProtectedRoute from './Config/ProtectedRoute.js';
import { AuthProvider } from './Context/AuthContext.js';
import { useAuth } from './Context/AuthContext.js';

function App() {
  const [user, setUser] = useState((JSON.parse(localStorage.getItem("user"))) || {});
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element = {<ProtectedRoute />}>
          <Route path="/" element={<Dashboard user={user} setUser={setUser}/>} />
          <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser}/>} />
          <Route path="/dues" element={<Dues user={user}/>} />
          <Route path="/savings" element={<Savings2 user={user} />} />
          <Route path="/groups" element={<Main user={user}/>} />
          <Route path="/billsplit/:id" element={<Grouphome user={user}/>} />
          <Route path="/simplifydebt/:id" element={<SimplifyDebt user={user}/>} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser}/>} />
          <Route path="/inbox" element={<Inbox user={user} setUser={setUser}/>} /> 
        </Route>
        <Route path='*' element={<p>Error 404 </p>}/>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
