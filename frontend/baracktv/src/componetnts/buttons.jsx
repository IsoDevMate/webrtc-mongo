// ButtonComponent.js

import React from 'react';

const ButtonComponent = ({ onToggleMute, isMuted }) => {
  const handleStart = () => {
    console.log('Start button clicked');
    // Add your logic here
  };

  const handleCall = () => {
    console.log('Call button clicked');
    // Add your logic here
  };

  const handleHangUp = () => {
    console.log('Hang Up button clicked');
    // Add your logic here
  };

  const handleToggleMute = () => {
    onToggleMute(); // Call the provided function to toggle mute
  };

  const buttonStyle = {
    margin: '10px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    backgroundColor: '#008CBA',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  };

  const muteButtonStyle = {
    ...buttonStyle,
    backgroundColor: isMuted ? '#dc3545' : '#28a745', // Red when muted, green when unmuted
  };

  return (
    <div>
      <button style={buttonStyle} onClick={handleStart}>
        Start
      </button>
      <button style={buttonStyle} onClick={handleCall}>
        Call
      </button>
      <button style={buttonStyle} onClick={handleHangUp}>
        Hang Up
      </button>
      <button style={muteButtonStyle} onClick={handleToggleMute}>
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  );
};

export default ButtonComponent;
