import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const UserLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/accounts/login/", loginData);
      const data = response.data;
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-400">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }} 
        className="backdrop-blur-md bg-white/30 shadow-2xl rounded-3xl p-8 w-full max-w-md border border-white/20"
      >
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">Admin Login</h2>
        <form onSubmit={submitHandler} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/70 focus:ring-2 ring-blue-500 placeholder-gray-600"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/70 focus:ring-2 ring-blue-500 placeholder-gray-600"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:from-indigo-600 hover:to-blue-600 transition-all"
          >
            Log In
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          {/* <button
            onClick={() => navigate('/signup')}
            className="text-white underline text-sm hover:text-blue-100"
          >
            Don’t have an account? Sign up here
          </button> */}
        </div>
      </motion.div>
    </div>
  );
};

export default UserLogin;
