// WebRTC Configuration
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

// Socket.io connection
const socket = io();

// Global variables
let localStream = null;
let remoteStream = null;
let peerConnections = new Map(); // For multiple peers
let currentRoom = null;
let isVideoEnabled = true;
let isAudioEnabled = true;

// DOM elements
const lobby = document.getElementById('lobby');
const videoChat = document.getElementById('videoChat');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const remotePlaceholder = document.getElementById('remotePlaceholder');
const connectionStatus = document.getElementById('connectionStatus');
const roomInput = document.getElementById('roomInput');
const myRoomIdDisplay = document.getElementById('myRoomId');

// Initialize the application
async function init() {
    try {
        // Get user media
        localStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 },
            audio: true
        });
        
        localVideo.srcObject = localStream;
        console.log('Local stream initialized');
        
        setupSocketListeners();
    } catch (error) {
        console.error('Error accessing media devices:', error);
        updateStatus('Failed to access camera/microphone', 'disconnected');
    }
}

// Setup Socket.io event listeners
function setupSocketListeners() {
    socket.on('connect', () => {
        console.log('Connected to server:', socket.id);
    });

    socket.on('user-joined', async (userId) => {
        console.log('User joined room:', userId);
        updateStatus('Peer joined, establishing connection...', 'connecting');
        await createPeerConnection(userId, true);
    });

    socket.on('existing-users', async (users) => {
        console.log('Found existing users in room:', users);
        if (users.length > 0) {
            updateStatus('Found peer, establishing connection...', 'connecting');
            for (const userId of users) {
                await createPeerConnection(userId, false);
            }
        } else {
            updateStatus('Waiting for peer to join...', 'connecting');
        }
    });

    socket.on('offer', async (data) => {
        console.log('Received offer from:', data.sender);
        await handleOffer(data.offer, data.sender);
    });

    socket.on('answer', async (data) => {
        console.log('Received answer from:', data.sender);
        await handleAnswer(data.answer, data.sender);
    });

    socket.on('ice-candidate', async (data) => {
        console.log('Received ICE candidate from:', data.sender);
        await handleIceCandidate(data.candidate, data.sender);
    });

    socket.on('user-left', (userId) => {
        console.log('User left room:', userId);
        handlePeerLeave(userId);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
        updateStatus('Disconnected from server', 'disconnected');
    });
}

// Create a new room
// function createRoom() {
//     currentRoom = generateRoomId();
//     myRoomIdDisplay.textContent = `Your Room ID: ${currentRoom}`;
//     // Also show in video chat screen
//     const roomInfo = document.getElementById('roomInfo');
//     roomInfo.textContent = `Room ID: ${currentRoom}`;
//     joinRoomSocket(currentRoom);
//     showVideoChat();
//     updateStatus('Waiting for peer to join...', 'connecting');
// }

// Join an existing room
function joinRoom() {
    currentRoom = "main-room";
    console.log('Joining room:', currentRoom);
    joinRoomSocket();
    showVideoChat();
    updateStatus('Connecting to room...', 'connecting');
}


// Join room via Socket.io
function joinRoomSocket() {
    socket.emit('join-room');
}


// Create peer connection
async function createPeerConnection(userId, shouldCreateOffer) {
    console.log(`Creating peer connection with ${userId}, shouldCreateOffer: ${shouldCreateOffer}`);
    
    const peerConnection = new RTCPeerConnection(configuration);
    peerConnections.set(userId, peerConnection);
    
    // Add local stream tracks
    if (localStream) {
        localStream.getTracks().forEach(track => {
            console.log('Adding track to peer connection:', track.kind);
            peerConnection.addTrack(track, localStream);
        });
    }
    
    // Handle remote stream
    peerConnection.ontrack = (event) => {
        console.log('Received remote track from:', userId, event.streams[0]);
        remoteStream = event.streams[0];
        remoteVideo.srcObject = remoteStream;
        remotePlaceholder.style.display = 'none';
        remoteVideo.style.display = 'block';
        updateStatus('Connected to peer!', 'connected');
    };
    
    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log('Sending ICE candidate to:', userId);
            socket.emit('ice-candidate', {
                candidate: event.candidate,
                target: userId
            });
        }
    };
    
    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
        console.log('Connection state with', userId, ':', peerConnection.connectionState);
        
        switch (peerConnection.connectionState) {
            case 'connected':
                updateStatus('Connected to peer!', 'connected');
                break;
            case 'disconnected':
                updateStatus('Peer disconnected', 'disconnected');
                break;
            case 'failed':
                updateStatus('Connection failed', 'disconnected');
                handlePeerLeave(userId);
                break;
            case 'connecting':
                updateStatus('Connecting to peer...', 'connecting');
                break;
        }
    };
    
    // Handle ICE connection state
    peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state with', userId, ':', peerConnection.iceConnectionState);
    };
    
    // Create offer if this peer should initiate
    if (shouldCreateOffer) {
        console.log('Creating offer for:', userId);
        try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            
            socket.emit('offer', {
                offer: offer,
                target: userId
            });
            console.log('Offer sent to:', userId);
        } catch (error) {
            console.error('Error creating offer:', error);
        }
    }
    
    return peerConnection;
}

// Handle received offer
async function handleOffer(offer, senderId) {
    console.log('Handling offer from:', senderId);
    let peerConnection = peerConnections.get(senderId);
    
    if (!peerConnection) {
        console.log('Creating new peer connection for offer from:', senderId);
        peerConnection = await createPeerConnection(senderId, false);
    }
    
    try {
        await peerConnection.setRemoteDescription(offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        
        socket.emit('answer', {
            answer: answer,
            target: senderId
        });
        console.log('Answer sent to:', senderId);
    } catch (error) {
        console.error('Error handling offer:', error);
    }
}

// Handle received answer
async function handleAnswer(answer, senderId) {
    console.log('Handling answer from:', senderId);
    const peerConnection = peerConnections.get(senderId);
    if (peerConnection) {
        try {
            await peerConnection.setRemoteDescription(answer);
            console.log('Remote description set for:', senderId);
        } catch (error) {
            console.error('Error handling answer:', error);
        }
    }
}

// Handle ICE candidate
async function handleIceCandidate(candidate, senderId) {
    console.log('Handling ICE candidate from:', senderId);
    const peerConnection = peerConnections.get(senderId);
    if (peerConnection) {
        try {
            await peerConnection.addIceCandidate(candidate);
            console.log('ICE candidate added for:', senderId);
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
        }
    }
}

// Handle peer leaving
function handlePeerLeave(userId) {
    console.log('Handling peer leave:', userId);
    const peerConnection = peerConnections.get(userId);
    if (peerConnection) {
        peerConnection.close();
        peerConnections.delete(userId);
    }
    
    // If this was the only peer, reset the UI
    if (peerConnections.size === 0) {
        if (remoteStream) {
            remoteStream.getTracks().forEach(track => track.stop());
            remoteStream = null;
        }
        
        remoteVideo.srcObject = null;
        remoteVideo.style.display = 'none';
        remotePlaceholder.style.display = 'flex';
        updateStatus('Waiting for peer to join...', 'connecting');
    }
}

// Utility functions
// function generateRoomId() {
//     return Math.random().toString(36).substring(2, 15) + 
//            Math.random().toString(36).substring(2, 15);
// }

function showVideoChat() {
    lobby.classList.add('hidden');
    videoChat.style.display = 'block';
}

function showLobby() {
    lobby.classList.remove('hidden');
    videoChat.style.display = 'none';
    myRoomIdDisplay.textContent = '';
    roomInput.value = '';
}

function updateStatus(message, type) {
    connectionStatus.textContent = message;
    connectionStatus.className = `status ${type}`;
}

// Control functions
function toggleVideo() {
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            isVideoEnabled = videoTrack.enabled;
            
            const button = document.getElementById('toggleVideo');
            button.classList.toggle('muted', !isVideoEnabled);
            button.textContent = isVideoEnabled ? '📹' : '📹';
            button.style.background = isVideoEnabled ? 
                'rgba(255, 255, 255, 0.2)' : '#f44336';
        }
    }
}

function toggleAudio() {
    if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            isAudioEnabled = audioTrack.enabled;
            
            const button = document.getElementById('toggleAudio');
            button.classList.toggle('muted', !isAudioEnabled);
            button.textContent = isAudioEnabled ? '🎤' : '🎤';
            button.style.background = isAudioEnabled ? 
                'rgba(255, 255, 255, 0.2)' : '#f44336';
        }
    }
}

function endCall() {
    // Leave room via socket
    socket.emit('leave-room');
    
    // Clean up all peer connections
    for (const [userId, peerConnection] of peerConnections) {
        peerConnection.close();
    }
    peerConnections.clear();
    
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    
    if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
    }
    
    // Reset UI
    showLobby();
    updateStatus('Disconnected', 'disconnected');
    
    // Reinitialize
    init();
}

// Event listeners
document.getElementById('toggleVideo').addEventListener('click', toggleVideo);
document.getElementById('toggleAudio').addEventListener('click', toggleAudio);
document.getElementById('endCall').addEventListener('click', endCall);

// Handle Enter key in room input
// roomInput.addEventListener('keypress', (e) => {
//     if (e.key === 'Enter') {
//         joinRoom();
//     }
// });

// Initialize when page loads
window.addEventListener('load', init);

// Clean up when page unloads
window.addEventListener('beforeunload', () => {
    socket.emit('leave-room');
});