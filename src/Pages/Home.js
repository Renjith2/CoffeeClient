import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../APICALLS';
import Admin from './Admin';
import { Tabs } from 'antd';
import AdminOrder from './AdminOrder';
const { TabPane } = Tabs;

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


 useEffect(()=>{
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect to login if no token found
        return;
      }
  
      const response = await axiosInstance.get('/api/user/get-current-user');
      console.log(response); // Debugging: Log the full response
  
      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        // Check user role and navigate accordingly
        if (userData.isAdmin) {
          navigate('/home'); // Redirect to admin page if isAdmin
        } else {
          navigate('/user'); // Redirect to user page if not admin
        }
      } else {
        console.error(response.data.message);
        // Handle error or redirect to login
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error or redirect to login
      navigate('/login');
    }
  };
  fetchUserData()
 },[])
   
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
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
      <Tabs  defaultActiveKey="1">
       <TabPane tab='products' key='1'> <Admin/></TabPane>
       <TabPane tab='orders' key='2'> <AdminOrder/></TabPane>
       </Tabs>
      </div>
    </>
  );
};

export default Header;
