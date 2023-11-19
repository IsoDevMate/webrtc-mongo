import React from 'react';

const Video = ({ label }) => (
  <div style={{ border: '1px solid black', margin: '10px', width: 'calc(33% - 20px)', height: '200px', backgroundColor: 'grey',borderRadius: '15px'}}>
    {label}
  </div>
);

const MainVideo = ({ label }) => (
  <div style={{ border: '1px solid black', margin: '10px', width: '100%', height: '300px', backgroundColor: 'grey' , borderRadius: '15px'}}>
    {label}
  </div>
);

const VideoChat = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
    <MainVideo label="Main Video" />
    <Video label="userOne" />
    <Video label="userTwo" />
    <Video label="userThree" />
    </div>
);

export default VideoChat;