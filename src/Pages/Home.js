import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../APICALLS';
import Admin from './Admin';

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/api/user/get-current-user');
        console.log(response); // Debugging: Log the full response

        if (response.data.success) {
          setUser(response.data.data);
          console.log(user)
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <header className="bg-blue-500 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          {user && <span className="text-white text-lg font-bold">{user.name}</span>}
        </div>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-500 px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none hover:bg-blue-200 transition duration-300"
        >
          Logout
        </button>
      </header>
      <div style={{ marginTop: '120px' }}>
        <Admin />
      </div>
    </>
  );
};

export default Header;
