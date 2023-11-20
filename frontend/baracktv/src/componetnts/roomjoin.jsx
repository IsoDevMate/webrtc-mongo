import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v1 as uuid } from "uuid";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

const RoomActions = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  const loadingSkeleton = (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <>
        <Skeleton height={30} width={250} duration={2} />
        <div>
          <Skeleton height={30} width={250} duration={2} />
          <Skeleton height={30} width={250} duration={2} />
        </div>
      </>
    </SkeletonTheme>
  );

  function createRoom() {
    setLoading(true);
    const id = uuid();
    setTimeout(() => {
      navigate(`/room/${id}`);
      setLoading(false);
    }, 4000);
  }

  function joinRoom() {
    setLoading(true);
    setTimeout(() => {
      navigate(`/room/${roomId}`);
      setLoading(false);
    }, 4000);
  }

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    backgroundColor: '#008CBA',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
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
      {loading ? loadingSkeleton : (
        <>
          <button style={buttonStyle} onClick={createRoom}>
            Create Room
          </button>
          <div>
            <input
              style={inputStyle}
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
            />
            <button style={buttonStyle} onClick={joinRoom}>
              Join Room
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RoomActions;
