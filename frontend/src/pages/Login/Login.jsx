import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import GoogleButton from 'react-google-button';

function Login({ user, setUser }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handlePasswordChange = (event) => {
    event.preventDefault();
    const newPassword = event.target.value;
    setPassword(newPassword);
  };

  const handleUsernameChange = (event) => {
    event.preventDefault();
    const newUsername = event.target.value;
    setUsername(newUsername);
  };

  const submitFunction = async (event) => {
    event.preventDefault();
    if (username.length < 5) {
      alert("Username must be at least 5 characters long.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    const userData = { username, password };
    console.log(userData)
    // try {
    //   const res = await axios.post("http://localhost:3001/api/auth/signin", userData);
    //   setUser(res.data);
    //   localStorage.setItem('user', JSON.stringify(res.data));
    //   navigate('/dashboard');
    // } catch (err) {
    //   console.log(err);
    // }

    setPassword("");
    setUsername("");
    alert("Logged in successfully");
  };

  return (
    <>
      <form onSubmit={submitFunction} className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
          <div className="text-3xl font-bold text-center text-purple-600 mb-6">Login</div>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="username" className="text-sm font-semibold">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                name="username"
                onChange={handleUsernameChange}
                className="input-login border-b-2 border-purple-600 py-2 px-3 focus:outline-none focus:border-purple-700 transition duration-300"
                required
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-semibold">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                className="input-login border-b-2 border-purple-600 py-2 px-3 focus:outline-none focus:border-purple-700 transition duration-300"
                required
              />
            </div>

            <button 
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              Login
            </button>

            <div className="text-center text-sm">
              Not having any account? 
              <Link to="/signup" className="text-purple-600 hover:underline font-semibold">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default Login;
