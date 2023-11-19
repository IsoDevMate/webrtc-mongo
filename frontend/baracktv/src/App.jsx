import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import  RoomLogic from "./componetnts/roomlogic";
import './App.css';
import RoomActions from './componetnts/roomjoin';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoomActions />} />
          <Route path="/room/:roomID" element={<RoomLogic />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
