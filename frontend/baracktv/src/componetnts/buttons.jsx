import React from 'react';

const ButtonComponent = () => {
    const handleStart = () => {
        console.log('Start button clicked');
        // Add your logic here
    }

    const handleCall = () => {
        console.log('Call button clicked');
        // Add your logic here
    }

    const handleHangUp = () => {
        console.log('Hang Up button clicked');
        // Add your logic here
    }

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

    return (
        <div>
            <button style={buttonStyle} onClick={handleStart}>Start</button>
            <button style={buttonStyle} onClick={handleCall}>Call</button>
            <button style={buttonStyle} onClick={handleHangUp}>Hang Up</button>
        </div>
    );
}

export default ButtonComponent;
