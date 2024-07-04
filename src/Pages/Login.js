

import React, { useEffect, useState } from "react";
import { validPassword, validEmail } from "./Validation";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../APICALLS/user";
import { message } from "antd";
import { axiosInstance } from '../APICALLS/index'; // Replace with your actual axios instance import

function Login() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError({ ...error, [name]: "" });
  };

  const fetchUserData = async () => {
    try {
      console.log("first")
      const response = await axiosInstance.get('/api/user/get-current-user');
      setUser(response.data);
      console.log(response.data)
      if (response.data.data.isAdmin) {
        navigate('/home');
      } else {
        navigate('/user');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchUserData();
    }
  }, []); // Empty dependency array to run only once on component mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = validEmail(formData.email);
    const passwordError = validPassword(formData.password);

    const newErrors = {};
    if (emailError) {
      newErrors.email = emailError;
    }
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    try {
      const response = await loginUser(formData);
      if (response.success) {
        message.success(response.message);
        localStorage.setItem('token', response.data);
        fetchUserData(); // Fetch user data after successful login
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
      message.error('Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-500">
      <div className="w-full max-w-md bg-white shadow-md rounded px-8 pb-8 pt-12">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center">
            <label htmlFor="email" className="text-gray-700 text-sm font-bold mr-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-400 p-2 w-full"
            />
            {error.email && <span className="text-red-500 text-sm">{error.email}</span>}
          </div>
          <div className="mb-4 flex items-center">
            <label htmlFor="password" className="text-gray-700 text-sm font-bold mr-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-400 p-2 w-full"
            />
            {error.password && <span className="text-red-500 text-sm">{error.password}</span>}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >Login
            </button>
          </div>
          <div className="flex justify-center">
            <Link to="/"> <button type="button" className="text-blue-500">Not Registered?</button> </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
