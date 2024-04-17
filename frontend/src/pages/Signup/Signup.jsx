import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';
import GoogleButton from 'react-google-button';

function Signup({ user, setUser }) {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('')
  const [confirmpass, setConformpass] = useState('');
  const [isPass, isPassValid] = useState(false);
  const [isUsername, isUsernameValid] = useState(false);

  const handlePasswordChange = (event) => {
    event.preventDefault();
    const newPassword = event.target.value;
    if (newPassword.length < 8) {
      setPassword(false);
    }
    setPassword(newPassword);
    isPassValid(newPassword.length >= 8);
  };

  const handleEmail = (event) => {
    const k = event.target.value;
    setEmail(k);
  };

  const handleUsernameChange = (event) => {
    event.preventDefault();
    const newUsername = event.target.value;
    setUsername(newUsername);
    isUsernameValid(newUsername.length >= 5);
  };
  const handleNameChange = (event)=>{
    event.preventDefault();
    setName(event.target.value)
  }

  const confirm = (event) => {
    event.preventDefault();
    const k = event.target.value;
    setConformpass(k);
  };

  const emptyConfirmpass = () => {
    setConformpass('');
  };

  const submitFunction = async (event) => {
    event.preventDefault();

    if (isPass && isUsername && confirmpass === password) {
      try {
        const res = await axios.post('http://localhost:3001/auth/register', {
          name,
          username,
          email,
          password,
        });

        setUser(res.data.newUser);
        localStorage.setItem('user', JSON.stringify(res.data.newUser));
        navigate('/dashboard');
        console.log({name, username, email, password})
        setEmail('');
        setPassword('');
        setUsername('');
        emptyConfirmpass();
        alert('Logged in successfully');
      } catch (err) {
        if (err.response && err.response.status === 400) {
          console.log(err);
        } else {
          console.log(err);
        }
      }
    } else {
      if (confirmpass !== password) {
        alert("Password and confirmed password didn't match");
      } else {
        alert('Invalid username or password. Make sure username is >= 5 characters and password is >= 8 characters');
      }
    }
  };

  return (
    <form action="" onSubmit={submitFunction} className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <div className="text-3xl font-bold text-center text-purple-600 mb-6">Sign Up</div>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="uname" className="text-sm font-semibold">Username</label>
            <input
              type="text"
              value={username}
              placeholder="Enter your username"
              name="uname"
              onChange={handleUsernameChange}
              className="input-signup border-b-2 border-purple-600 py-2 px-3 focus:outline-none focus:border-purple-700 transition duration-300"
              required
            />
          </div>
          <div>
          <label htmlFor="name" className="text-sm font-semibold">Name</label>
            <input
              type="text"
              value={name}
              placeholder="Enter your name"
              name="uname"
              onChange={handleNameChange}
              className="input-signup border-b-2 border-purple-600 py-2 px-3 focus:outline-none focus:border-purple-700 transition duration-300"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-semibold">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              className="input-signup border-b-2 border-purple-600 py-2 px-3 focus:outline-none focus:border-purple-700 transition duration-300"
              value={email}
              onChange={handleEmail}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="psw" className="text-sm font-semibold">Password</label>
            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              className="input-signup border-b-2 border-purple-600 py-2 px-3 focus:outline-none focus:border-purple-700 transition duration-300"
              onChange={handlePasswordChange}
              name="psw"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="text-sm font-semibold">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmpass}
              name="confirmPassword"
              onChange={confirm}
              className="input-signup border-b-2 border-purple-600 py-2 px-3 focus:outline-none focus:border-purple-700 transition duration-300"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          >
            Submit
          </button>

          <div className="text-center text-sm">
            Already have an account?
            <Link to="/login" className="text-purple-600 hover:underline font-semibold">
              Login
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Signup;
