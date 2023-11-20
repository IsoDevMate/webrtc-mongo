

import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const colorMapping = {
  success: '#28a745',
  error: '#dc3545',
  default: '#007bff',
};

const Notification = ({ type, message }) => {
  const notify = () => toast[type](message, {
    position: "top-right", // Change the position as needed
    autoClose: 5000, // 5 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: {
      // Customize the notification style
      background: colorMapping[type] || colorMapping.default,
      color: '#fff',
      borderRadius: '5px',
    },
  });

  return (
    <div>
      <ToastContainer />
      {notify()}
    </div>
  );
};

export default Notification;
