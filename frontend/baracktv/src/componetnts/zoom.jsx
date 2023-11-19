import React from 'react';

const ZoomMeeting = () => {
  return (
    <div className="zoom-meeting">
      <h1 className="zoom-meeting__title">Zoom Meeting</h1>
      <div className="zoom-meeting__participants">
        <h2>Participants</h2>
        <ul>
          <li>
            <img src="https://i.imgur.com/abc123.png" alt="Participant 1 avatar" />
            <span></span>
          </li>
          <li>
            <img src="https://i.imgur.com/def456.png" alt="Participant 2 avatar" />
            <span>Jane Smith</span>
          </li>
          <li>
            <img src="https://i.imgur.com/ghi789.png" alt="Participant 3 avatar" />
            <span>Peter Jones</span>
          </li>
        </ul>
      </div>
      <div className="zoom-meeting__chat">
        <h2>Chat</h2>
        <textarea placeholder="Type your message here..." />
      </div>
      <div className="zoom-meeting__controls">
        <button>Mute Microphone</button>
        <button>Unmute Microphone</button>
        <button>Turn Off Camera</button>
        <button>Turn On Camera</button>
        <button>End Call</button>
      </div>
    </div>
  );
};

const styles = {
  zoomMeeting: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  zoomMeeting__title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  zoomMeeting__participants: {
    width: '300px',
    height: '200px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    padding: 10,
  },
  zoomMeeting__chat: {
    width: '500px',
    height: '300px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    padding: 10,
    marginTop: 20,
  },
  zoomMeeting__controls: {
    marginTop: 20,
  },
};

export default ZoomMeeting;
