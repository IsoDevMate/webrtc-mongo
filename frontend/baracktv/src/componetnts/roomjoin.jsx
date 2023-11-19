import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v1 as uuid } from "uuid";

const RoomActions = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState("");

    function createRoom() {
        const id = uuid();
        navigate(`/room/${id}`);
    }

    function joinRoom() {
        navigate(`/room/${roomId}`);
    }

    const buttonStyle = {
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '5px',
        backgroundColor: '#008CBA', /* Blue */
        color: 'white', /* White text */
        border: 'none', /* Remove borders */
        cursor: 'pointer', /* Mouse pointer on hover */
        margin: '10px',
    };

    const inputStyle = {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        margin: '10px',
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            gap: '10px', 
            backgroundColor: '#333' 
        }}>
            <button style={buttonStyle} onClick={createRoom}>Create Room</button>
            <div>
                <input style={inputStyle} type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Enter Room ID" />
                <button style={buttonStyle} onClick={joinRoom}>Join Room</button>
            </div>
        </div>
    );
}

export default RoomActions;
