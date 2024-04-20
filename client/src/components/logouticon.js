import React from 'react';
import axios from 'axios';
import { CgLogOut } from "react-icons/cg";

const LogoutIcon = ({toggleWelcomePage}) => {

  const handleLogout = async () => {
    try {
      // Send POST request to the server for logout
      await axios.post('http://localhost:8000/logout');
      // Redirect to the welcome page after successful logout
      toggleWelcomePage();
      //alert('logout succsess!!!!!');
     //window.location.href = '/'; // Redirect to the welcome page
    } catch (error) {
      console.error('Logout failed!!!!!!!:', error);
      alert('logout fail ＼(｀0´)／');
    }
  };

  return (
    <CgLogOut title="Log out" id="logouticon" className="logout-icon" onClick={handleLogout}/>
  );
};

export default LogoutIcon;

