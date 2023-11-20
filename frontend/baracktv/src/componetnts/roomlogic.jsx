// RoomLogic.js

import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import ButtonComponent from "./buttons";
import { useParams } from "react-router-dom";
import Notification from './notification';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const RoomLogic = () => {
  const { roomID } = useParams();
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const socketRef = useRef();
  const otherUser = useRef();
  const userStream = useRef();
  const [notifications, setNotifications] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
      userVideo.current.srcObject = stream;
      userStream.current = stream;

      socketRef.current = io.connect("http://localhost:5000");
      socketRef.current.emit("join room", roomID);

      socketRef.current.on('other user', handleOtherUser);
      socketRef.current.on("user joined", handleUserJoined);
      socketRef.current.on("offer", handleReceiveCall);
      socketRef.current.on("answer", handleAnswer);
      socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
      socketRef.current.on('user connected', handleUserConnected);
      socketRef.current.on('user disconnected', handleUserDisconnected);
      socketRef.current.on('user muted', handleUserMuted);
      socketRef.current.on('user unmuted', handleUserUnmuted);
    });
  }, [roomID]);

  const handleOtherUser = (userID) => {
    if (!peerRef.current) {
      callUser(userID);
      otherUser.current = userID;
    }
  };

  const handleUserJoined = (userID) => {
    otherUser.current = userID;
  };

  const handleUserConnected = (userID) => {
    setNotifications(prevNotifications => [
      ...prevNotifications,
      { type: 'success', message: `A user connected: ${userID}` }
    ]);
  };

  const handleUserDisconnected = (userID) => {
    setNotifications(prevNotifications => [
      ...prevNotifications,
      { type: 'error', message: `A user disconnected: ${userID}` }
    ]);
  };

  const handleUserMuted = (userID) => {
    setNotifications(prevNotifications => [
      ...prevNotifications,
      { type: 'info', message: `A user muted: ${userID}` }
    ]);
  };

  const handleUserUnmuted = (userID) => {
    setNotifications(prevNotifications => [
      ...prevNotifications,
      { type: 'info', message: `A user unmuted: ${userID}` }
    ]);
  };

  function callUser(userID) {
    peerRef.current = createPeer(userID);
    userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
  }

  function createPeer(userID) {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302"
        },
        {
          urls: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com'
        },
      ]
    });

    peer.onicegatheringstatechange = function () {
      console.log("ICE gathering state changed: " + peer.iceGatheringState);
    }
    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    return peer;
  }

  async function handleNegotiationNeededEvent(userID) {
    try {
      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);
      const payload = {
        target: userID,
        caller: socketRef.current.id,
        sdp: peerRef.current.localDescription
      };
      socketRef.current.emit("offer", payload);
    } catch (e) {
      console.log("an error occurred", e);
    }
  }

  async function handleReceiveCall(incoming) {
    try {
      if (!peerRef.current) {
        peerRef.current = createPeer();
      }
      const desc = new RTCSessionDescription(incoming.sdp);
      await peerRef.current.setRemoteDescription(desc);
      userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);
      const payload = {
        target: incoming.caller,
        caller: socketRef.current.id,
        sdp: peerRef.current.localDescription
      };
      socketRef.current.emit("answer", payload);
    } catch (error) {
      console.error(error);
    }
  }

  function handleAnswer(message) {
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
  }

  function handleICECandidateEvent(e) {
    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate,
      }
      socketRef.current.emit("ice-candidate", payload);
    }
  }

  function handleNewICECandidateMsg(incoming) {
    const candidate = new RTCIceCandidate(incoming);

    peerRef.current.addIceCandidate(candidate)
      .catch(e => console.log(e));
  }


  const videoSkeleton = (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <Skeleton height={360} width={640} duration={2} />
    </SkeletonTheme>
  );

  function handleTrackEvent(e) {
    console.log("Track event occurred");  // This should be logged when a track event occurs
    setTimeout(() => {
      partnerVideo.current.srcObject = e.streams[0];
      setLoading(false);
      console.log("Loading state set to false");  // This should be logged after 2 seconds
    }, 2000);
  };


  useEffect(() => {
    notifications.forEach(notification => {
      Notification({ type: notification.type, message: notification.message });
    });
  }, [notifications]);

  const toggleMute = () => {
    const tracks = userStream.current.getAudioTracks();

    tracks.forEach(track => {
      track.enabled = !isMuted;
    });

    setIsMuted(!isMuted);

    const event = isMuted ? 'user unmuted' : 'user muted';
    socketRef.current.emit(event, socketRef.current.id);
  };

 return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#333'
    }}>
      {loading ? videoSkeleton : (
        <>
          <video style={{ borderRadius: '15px', margin: '10px' }} autoPlay ref={userVideo} />
          <video style={{ borderRadius: '15px', margin: '10px' }} autoPlay ref={partnerVideo} />
          <ButtonComponent onToggleMute={toggleMute} isMuted={isMuted} />
        </>
      )}
    </div>
  );
};

export default RoomLogic;
