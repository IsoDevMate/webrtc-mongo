import React, { useRef, useEffect } from "react";
import io from "socket.io-client";
import ButtonComponent from "./buttons";
import { useParams } from "react-router-dom";

const RoomLogic = () => {
    const { roomID } = useParams(); // Access route parameters with useParams
    const userVideo = useRef();
    const partnerVideo = useRef();
    const peerRef = useRef();
    const socketRef = useRef();
    const otherUser = useRef();
    const userStream = useRef();

    //we'll use our refs to attach the video streams to the video elements
    useEffect(() => { //ask the browser for permission to use the user's microphone and camera
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => { //promise resloves with a stream object
            userVideo.current.srcObject = stream; //attatch stream to src videoobject allows us to display  a video stream from the user's webcam
            userStream.current = stream;
            

            //connect to socket.io servver and emmit an event referncing the room id
            socketRef.current = io.connect("http://localhost:3000")
            socketRef.current.emit("join room", roomID); // Use roomID from useParams
           
            //server fires the event   by listen for other users joining the room
            socketRef.current.on('other user', userID => {
                callUser(userID);
                otherUser.current = userID;
            });

           //serverinforms users in the room that a new user has joined
            socketRef.current.on("user joined", userID => {
                otherUser.current = userID;
            });
           
            socketRef.current.on("offer", handleRecieveCall);

            socketRef.current.on("answer", handleAnswer);

            socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
        });

    }, []);
// attatch our stream{userstreamobj} to our peer connection.
    function callUser(userID) {
        peerRef.current = createPeer(userID);
        userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current)); //gettracsks has access to the user's audio and video tracks
    }//gives peer obj acccess to our stream for us to have an indid=vidual connection with each user

    function createPeer(userID) {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun4.l.google.com:19302"
                },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                },
            ]
        });

      
           
         //myConnection = new webkitRTCPeerConnection(configuration); 
         console.log("RTCPeerConnection object was created"); 
         console.log(peer); 
        
         // Save a list of ice candidates to send to the peer
         //const iceCandidates=[];

            /*peer.onicecandidate = function(event) {
                if (event.candidate) {
                    iceCandidates.push(event.candidate);
                }
            } */
        peer.onicegatheringstatechange = function() {
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
            console.log("an error occured", e);
        }
    }


    

    async function handleRecieveCall(incoming) {
        try {
            peerRef.current = createPeer();
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
        const candidate= new RTCIceCandidate(incoming);

        peerRef.current.addIceCandidate(candidate)
            .catch(e => console.log(e));
    }

    function handleTrackEvent(e) {
        partnerVideo.current.srcObject = e.streams[0];
    };

// how the uservideoref and partnervideoref are used
return (
    <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#333' 
    }}>
        <video style={{ borderRadius: '15px', margin: '10px' }} autoPlay ref={userVideo} />
        <video style={{ borderRadius: '15px', margin: '10px' }} autoPlay ref={partnerVideo} />
        <ButtonComponent />
    </div>
);

};

export default RoomLogic;