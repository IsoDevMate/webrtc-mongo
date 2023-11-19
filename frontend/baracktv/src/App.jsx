import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import  RoomLogic from "./componetnts/roomlogic";
import './App.css';
import RoomActions from './componetnts/roomjoin';
import ZoomMeeting from './componetnts/zoom';
import NotFound from './componetnts/Notfound';
import VideoChat from './componetnts/videochat';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoomActions />} />
          <Route path="/room/:roomID" element={<RoomLogic />} />
          <Route path="/test" element={<ZoomMeeting />} />
          <Route path="/tests" element={<VideoChat/>} />
          <Route path="*" element={<NotFound />}  />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
