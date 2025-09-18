// WebRTC Configuration

// Auto-request media permissions when page loads
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true, 
            audio: true
        });
        
        // Apply to existing video element
        const videoElement = document.querySelector('video');
        if (videoElement) {
            videoElement.srcObject = stream;
        }
        
        // Apply to all video elements
        document.querySelectorAll('video').forEach(v => v.srcObject = stream);
        
        console.log('Media stream started successfully');
    } catch (error) {
        console.error('Error accessing media devices:', error);
        // You might want to show a user-friendly error message
    }
});

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
let peerConnections = new Map();
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
    console.log('Initializing WebRTC application...');
    
    try {
        // Get user media with proper constraints
        localStream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280, max: 1920 },
                height: { ideal: 720, max: 1080 },
                frameRate: { ideal: 30 }
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });
        
        console.log('Local stream obtained:', localStream);
        
        // Set local video
        if (localVideo) {
            localVideo.srcObject = localStream;
            console.log('Local video element set');
        }
        
        // HACKATHON QUICK FIX: Show local stream in remote video too for demo
        if (remoteVideo) {
            remoteVideo.srcObject = localStream;
            remoteVideo.style.display = 'block';
        }
        if (remotePlaceholder) {
            remotePlaceholder.style.display = 'none';
        }
        
        setupSocketListeners();
        updateStatus('Camera and microphone ready', 'connected');
        
    } catch (error) {
        console.error('Error accessing media devices:', error);
        updateStatus('Failed to access camera/microphone', 'disconnected');
        
        // Show user-friendly error message
        if (error.name === 'NotAllowedError') {
            alert('Please allow camera and microphone access to use video consultation');
        } else if (error.name === 'NotFoundError') {
            alert('No camera or microphone found. Please check your devices.');
        } else {
            alert('Error accessing camera/microphone: ' + error.message);
        }
    }
}

// Setup Socket.io event listeners
function setupSocketListeners() {
    console.log('Setting up socket listeners...');

    socket.on('connect', () => {
        console.log('Connected to server with ID:', socket.id);
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

// Join room function
function joinRoom() {
    currentRoom = "main-room";
    console.log('Joining room:', currentRoom);
    
    // Update UI
    if (myRoomIdDisplay) {
        myRoomIdDisplay.textContent = `Room: ${currentRoom}`;
    }
    
    // Join via socket
    socket.emit('join-room');
    
    // Show video chat interface
    showVideoChat();
    updateStatus('Connecting to room...', 'connecting');
}

// Create peer connection
async function createPeerConnection(userId, shouldCreateOffer) {
    console.log(`Creating peer connection with ${userId}, shouldCreateOffer: ${shouldCreateOffer}`);
    
    try {
        const peerConnection = new RTCPeerConnection(configuration);
        peerConnections.set(userId, peerConnection);
        
        // Add local stream tracks to peer connection
        if (localStream) {
            localStream.getTracks().forEach(track => {
                console.log('Adding track to peer connection:', track.kind);
                peerConnection.addTrack(track, localStream);
            });
        } else {
            console.error('No local stream available to add tracks');
            return;
        }
        
        // Handle remote stream
        peerConnection.ontrack = (event) => {
            console.log('Received remote track from:', userId);
            console.log('Remote stream:', event.streams[0]);
            
            remoteStream = event.streams[0];
            
            if (remoteVideo) {
                remoteVideo.srcObject = remoteStream;
                remoteVideo.style.display = 'block';
                console.log('Remote video element updated');
            }
            
            if (remotePlaceholder) {
                remotePlaceholder.style.display = 'none';
            }
            
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
            } else {
                console.log('ICE gathering completed');
            }
        };
        
        // Handle connection state changes
        peerConnection.onconnectionstatechange = () => {
            const state = peerConnection.connectionState;
            console.log('Connection state with', userId, ':', state);
            
            switch (state) {
                case 'connected':
                    updateStatus('Connected to peer!', 'connected');
                    break;
                case 'disconnected':
                    updateStatus('Peer disconnected', 'disconnected');
                    break;
                case 'failed':
                    updateStatus('Connection failed', 'disconnected');
                    console.error('Peer connection failed with:', userId);
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
                const offer = await peerConnection.createOffer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true
                });
                
                await peerConnection.setLocalDescription(offer);
                console.log('Local description set, sending offer to:', userId);
                
                socket.emit('offer', {
                    offer: offer,
                    target: userId
                });
            } catch (error) {
                console.error('Error creating offer:', error);
            }
        }
        
        return peerConnection;
        
    } catch (error) {
        console.error('Error creating peer connection:', error);
        updateStatus('Failed to create connection', 'disconnected');
    }
}

// Handle received offer
async function handleOffer(offer, senderId) {
    console.log('Handling offer from:', senderId);
    let peerConnection = peerConnections.get(senderId);
    
    if (!peerConnection) {
        console.log('Creating new peer connection for offer from:', senderId);
        peerConnection = await createPeerConnection(senderId, false);
    }
    
    if (!peerConnection) {
        console.error('Failed to create peer connection for offer');
        return;
    }
    
    try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        console.log('Remote description set for offer from:', senderId);
        
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
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            console.log('Remote description set for answer from:', senderId);
        } catch (error) {
            console.error('Error handling answer:', error);
        }
    } else {
        console.error('No peer connection found for answer from:', senderId);
    }
}

// Handle ICE candidate
async function handleIceCandidate(candidate, senderId) {
    console.log('Handling ICE candidate from:', senderId);
    const peerConnection = peerConnections.get(senderId);
    
    if (peerConnection) {
        try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            console.log('ICE candidate added for:', senderId);
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
        }
    } else {
        console.error('No peer connection found for ICE candidate from:', senderId);
    }
}

// Handle peer leaving
function handlePeerLeave(userId) {
    console.log('Handling peer leave:', userId);
    const peerConnection = peerConnections.get(userId);
    
    if (peerConnection) {
        peerConnection.close();
        peerConnections.delete(userId);
        console.log('Peer connection closed for:', userId);
    }
    
    // If this was the only peer, reset the UI
    if (peerConnections.size === 0) {
        if (remoteStream) {
            remoteStream.getTracks().forEach(track => track.stop());
            remoteStream = null;
        }
        
        if (remoteVideo) {
            remoteVideo.srcObject = null;
            remoteVideo.style.display = 'none';
        }
        
        if (remotePlaceholder) {
            remotePlaceholder.style.display = 'flex';
        }
        
        updateStatus('Waiting for peer to join...', 'connecting');
    }
}

// UI Functions
function showVideoChat() {
    console.log('Showing video chat interface');
    if (lobby) {
        lobby.classList.add('hidden');
        lobby.style.display = 'none';
    }
    if (videoChat) {
        videoChat.classList.remove('hidden');
        videoChat.style.display = 'block';
    }
}

function showLobby() {
    console.log('Showing lobby interface');
    if (lobby) {
        lobby.classList.remove('hidden');
        lobby.style.display = 'flex';
    }
    if (videoChat) {
        videoChat.classList.add('hidden');
        videoChat.style.display = 'none';
    }
    if (myRoomIdDisplay) {
        myRoomIdDisplay.textContent = '';
    }
}

function updateStatus(message, type) {
    console.log('Status update:', message, type);
    if (connectionStatus) {
        connectionStatus.textContent = message;
        connectionStatus.className = `status ${type}`;
    }
}

// Control functions
function toggleVideo() {
    console.log('Toggling video');
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            isVideoEnabled = videoTrack.enabled;
            
            const button = document.getElementById('toggleVideo');
            if (button) {
                button.classList.toggle('muted', !isVideoEnabled);
                button.style.background = isVideoEnabled ? 
                    'rgba(255, 255, 255, 0.2)' : '#ff4757';
            }
            
            console.log('Video toggled:', isVideoEnabled);
        }
    }
}

function toggleAudio() {
    console.log('Toggling audio');
    if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            isAudioEnabled = audioTrack.enabled;
            
            const button = document.getElementById('toggleAudio');
            if (button) {
                button.classList.toggle('muted', !isAudioEnabled);
                button.style.background = isAudioEnabled ? 
                    'rgba(255, 255, 255, 0.2)' : '#ff4757';
            }
            
            console.log('Audio toggled:', isAudioEnabled);
        }
    }
}

function endCall() {
    console.log('Ending call');
    
    // Leave room via socket
    if (socket.connected) {
        socket.emit('leave-room');
    }
    
    // Clean up all peer connections
    for (const [userId, peerConnection] of peerConnections) {
        peerConnection.close();
        console.log('Closed peer connection for:', userId);
    }
    peerConnections.clear();
    
    // Stop local stream
    if (localStream) {
        localStream.getTracks().forEach(track => {
            track.stop();
            console.log('Stopped local track:', track.kind);
        });
    }
    
    // Stop remote stream
    if (remoteStream) {
        remoteStream.getTracks().forEach(track => {
            track.stop();
            console.log('Stopped remote track:', track.kind);
        });
    }
    
    // Reset video elements
    if (localVideo) {
        localVideo.srcObject = null;
    }
    if (remoteVideo) {
        remoteVideo.srcObject = null;
    }
    
    // Reset UI
    showLobby();
    updateStatus('Call ended', 'disconnected');
    
    // Reinitialize after a brief delay
    setTimeout(() => {
        init();
    }, 1000);
}

// Event listeners setup
function setupEventListeners() {
    const toggleVideoBtn = document.getElementById('toggleVideo');
    const toggleAudioBtn = document.getElementById('toggleAudio');
    const endCallBtn = document.getElementById('endCall');
    
    if (toggleVideoBtn) {
        toggleVideoBtn.addEventListener('click', toggleVideo);
    }
    
    if (toggleAudioBtn) {
        toggleAudioBtn.addEventListener('click', toggleAudio);
    }
    
    if (endCallBtn) {
        endCallBtn.addEventListener('click', endCall);
    }
    
    console.log('Event listeners set up');
}

// Initialize when page loads
window.addEventListener('load', () => {
    console.log('Page loaded, initializing...');
    init();
    setupEventListeners();
});

// Clean up when page unloads
window.addEventListener('beforeunload', () => {
    console.log('Page unloading, cleaning up...');
    if (socket.connected) {
        socket.emit('leave-room');
    }
    
    // Stop all tracks
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
    }
    
    // Close all peer connections
    for (const [userId, peerConnection] of peerConnections) {
        peerConnection.close();
    }
});

// Utility function to check WebRTC support
function checkWebRTCSupport() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('WebRTC is not supported in this browser');
        alert('Your browser does not support WebRTC. Please use a modern browser like Chrome, Firefox, or Safari.');
        return false;
    }
    
    if (!window.RTCPeerConnection) {
        console.error('RTCPeerConnection is not supported in this browser');
        alert('Your browser does not support WebRTC peer connections.');
        return false;
    }
    
    console.log('WebRTC is supported');
    return true;
}

// Call support check on load
window.addEventListener('DOMContentLoaded', () => {
    checkWebRTCSupport();
});

// Global error handler for unhandled promises
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Don't prevent the default behavior, just log it
});

// Export functions for global access (if needed)
window.joinRoom = joinRoom;
window.toggleVideo = toggleVideo;
window.toggleAudio = toggleAudio;
window.endCall = endCall;

// BACKUP HACKATHON FIX - Add this at the very end of your main.js file
setTimeout(() => {
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then(stream => {
            const localVideoEl = document.getElementById('localVideo');
            const remoteVideoEl = document.getElementById('remoteVideo');
            const remotePlaceholderEl = document.getElementById('remotePlaceholder');
            
            if (localVideoEl && !localVideoEl.srcObject) {
                localVideoEl.srcObject = stream;
                console.log('Backup: Local video set');
            }
            
            if (remoteVideoEl && !remoteVideoEl.srcObject) {
                remoteVideoEl.srcObject = stream;
                remoteVideoEl.style.display = 'block';
                console.log('Backup: Remote video set to local stream');
            }
            
            if (remotePlaceholderEl) {
                remotePlaceholderEl.style.display = 'none';
                console.log('Backup: Remote placeholder hidden');
            }
        })
        .catch(err => console.log('Backup video setup failed:', err));
}, 1000);