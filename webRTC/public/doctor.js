/*******************************
  MERGED JS: Prescription UI + WebRTC (Socket.io)
  Save as: merged.js
  Include socket.io client first in HTML:
  <script src="/socket.io/socket.io.js"></script>
  <script src="merged.js"></script>
*******************************/

/* -----------------------------
   Prescription / Dashboard Code
   (kept largely as-is, minor wiring to WebRTC below)
   -----------------------------*/

// Variables for disease selection
let selectedDisease = "";

// Global arrays / state
const medicineDatabase = [
 "Aceclofenac 100mg and Paracetamol 325mg Tablets",
        "Aceclofenac Tablets IP 100 mg",
        "Pregabalin Capsules IP 75 mg",
        "Aspirin Gastro-resistant Tablets IP 150 mg",
        "Chlorzoxazone 500mg, Diclofenac 50mg and Paracetamol 325mg Tablets",
        "Diclofenac Gel IP 1.16%w/w (Diclofenac Diethylamine)",
        "Serratiopeptidase 10mg and Diclofenac Sodium 50mg Tablets",
        "Diclofenac Sodium Prolonged Release Tablets IP 100 mg",
        "Diclofenac Sodium Injection IP 25mg per ml",
        "Diclofenac Gastro-Resistant Tablets IP 50 mg",
        "Etoricoxib Tablets IP 120 mg",
        "Etoricoxib Tablets IP 90 mg",
        "Ibuprofen 400mg and Paracetamol 325mg Tablets IP",
        "Ibuprofen Tablets IP 200 mg",
        "Ibuprofen Tablets IP 400 mg",
        "Indomethacin Capsules IP 25 mg",
        "Azithromycin Tablets IP 250 mg",
        "Nimesulide 100mg and Paracetamol 325mg Tablets",
        "Nimesulide Tablets 100 mg",
        "Diclofenac Sodium 50mg and Paracetamol 325mg Tablets IP",
        "Paracetamol Paediatric Oral Suspension IP 125 mg per 5 ml",
        "Paracetamol Tablets IP 500 mg",
        "Pentazocine Injection IP 30 mg per ml",
        "Serratiopeptidase Tablets IP 10 mg",
        "Tramadol Hydrochloride Injection 100 mg per 2 ml",
        "Tramadol HCl Injection 50mg 1 ml",
        "Tramadol Tablets 50mg",
        "Aciclovir Tablets IP 400 mg",
        "Amikacin Injection IP 100 mg per 2 ml",
        "Amikacin Injection IP 250 mg per 2 ml",
        "Amikacin Injection IP 500 mg per 2 ml",
        "Metformin Hydrochloride Prolonged-release 500mg and Glimepiride 2mg Tablets IP",
        "Amoxycillin 1g and Potassium Clavulanate 200mg Injection IP",
        "Amoxycillin 200mg and Potassium Clavulanate 28.5mg Oral Suspension IP per 5ml",
        "Amoxycillin 250mg and Potassium Clavulanate 50mg Injection IP",
        "Amoxycillin 500mg and Potassium Clavulanate 100mg Injection IP",
        "Amoxycillin 500mg and Potassium Clavulanate 125mg Tablets IP",
        "Amoxycillin 250mg and Cloxacillin 250mg Capsules",
        "Amoxycillin Trihydrate Dispersible Tablets IP 125 mg",
];

const testDatabase = [
 "17-hydroxyprogesterone immunoassay",
        "ABO blood groups and Rhesus factor typing point-of-care test",
        "Albumin",
        "Alkaline phosphatase",
        "Alanine aminotransferase (ALT)",
        "Amylase and lipase",
        "Antibodies to Treponema pallidum",
        "Aspartate aminotransferase (AST)",
        "Basic metabolic panel (BMP)",
        "Bilirubin",
        "Blood pH and gases",
        "Blood typing",
        "Blood urea nitrogen (BUN)",
        "CD4 cell enumeration",
        "Comprehensive metabolic panel",
        "C-reactive protein (CRP)",
        "Creatinine",
        "Cryptococcal antigen test",
        "Drug susceptibility testing of M. tuberculosis",
        "Electrolytes",
        "Estrogen (ER) and progesterone (PgR) receptors",
        "Glucose",
        "Glucose meter",
        "Glucose-6-phosphate dehydrogenase activity (G6PD)",
        "Haemoglobin (Hb)",
        "Haemoglobin A1c (HbA1c)",
        "Hepatitis B e antigen (HBeAg)",
        "Hepatitis B surface antigen (HBsAg)",
        "Hepatitis C virus antibody (anti-HCV Ab)",
        "Hepatitis E virus nucleic acid test",
        "High-sensitivity troponin I point-of-care test",
        "Histopathology and Cytology",
        "HIV 1/2 antibody (anti-HIV Ab)",
        "HIV western blot",
        "Human chorionic gonadotropin (hCG)",
        "Immune response by interferon-gamma release assay (IGRA)",
        "Immune response by Mycobacterium tuberculosis antibody detection test",
        "Immunoglobulin M antibodies to hepatitis E virus",
        "Immunoglobulin M antibodies to hepatitis E virus rapid diagnostic test",
        "Intradermal tuberculin skin test (TST)",
        "Kleihauer-Betke acid-elution test",
        "Lactate dehydrogenase (LDH)",
        "Lipoarabinomannan (LAM) antigen",
        "Loop mediated isothermal amplification (LAMP)",
        "Malaria microscopy",
        "Malaria rapid diagnostic test",
        "Meningitis/encephalitis multiplex polymerase chain reaction panel",
        "Microbiology cultures",
        "Mycobacterium tuberculosis DNA",
        "Parathyroid hormone",
        "Peripheral blood film examination",
        "Plasmodium spp.",
        "Plasmodium spp. antigens",
        "Prostate-specific antigen (PSA)",
        "SARS-CoV-2 nucleic acid test",
        "Serological tests for detection of typhoid antigen and immunoglobulin M/immunoglobulin G antibodies",
        "Combined antibodies to T. pallidum and HIV-1/2",
        "Combined HIV antibody/p24 antigen (anti-HIV/p24 Ag)",
        "Troponin",
        "Urine dipstick and urine microscopy",
        "White blood cell count",
        "Whole blood lactate",
        "Zika virus IgM antibody",
        "Zika virus nucleic acid test (NAT)",
];

let selectedMedicines = [];
let selectedTests = [];
let patientRemarks = "";
// NOTE: localStream will be provided by the WebRTC init (see below)
let userStream = null; // kept for compatibility with prescription UI (mapped to localStream by WebRTC init)
let isAudioMuted = false;
let isVideoOff = false;

// Helper: formatDate
function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/* ---------- Prescription UI handlers ---------- */

document.addEventListener("DOMContentLoaded", function () {
  const diseaseDropdown = document.getElementById("disease-dropdown");
  const otherDiseaseContainer = document.getElementById(
    "other-disease-container"
  );
  const otherDiseaseInput = document.getElementById("other-disease");
  const submitDiseaseButton = document.getElementById("submit-disease");
  const selectedDiseaseDisplay = document.getElementById(
    "selected-disease-display"
  );

  // Show/hide the "Other" input field based on dropdown selection
  if (diseaseDropdown) {
    diseaseDropdown.addEventListener("change", function () {
      if (this.value === "Other") {
        otherDiseaseContainer.style.display = "block";
      } else {
        otherDiseaseContainer.style.display = "none";
      }
    });
  }

  // Handle disease submission
  if (submitDiseaseButton) {
    submitDiseaseButton.addEventListener("click", function () {
      let diseaseValue = diseaseDropdown ? diseaseDropdown.value : "";

      // If "Other" is selected, use the text input value
      if (diseaseValue === "Other") {
        diseaseValue = otherDiseaseInput.value.trim();

        // Validate input
        if (!diseaseValue) {
          alert("Please specify the disease.");
          return;
        }
      }

      // If no disease is selected
      if (!diseaseValue || diseaseValue === "") {
        alert("Please select a disease.");
        return;
      }

      // Save the selected disease
      selectedDisease = diseaseValue;

      // Display the selected disease
      if (selectedDiseaseDisplay) {
        selectedDiseaseDisplay.style.display = "block";
        selectedDiseaseDisplay.innerHTML = `
          <span class="selected-disease">${selectedDisease}</span>
          <button class="remove-disease" onclick="removeDisease()">Remove</button>
        `;
      }

      // Reset form elements
      if (diseaseDropdown) diseaseDropdown.selectedIndex = 0;
      if (otherDiseaseInput) otherDiseaseInput.value = "";
      if (otherDiseaseContainer) otherDiseaseContainer.style.display = "none";

      // Store in localStorage
      localStorage.setItem("selectedDisease", selectedDisease);
    });
  }
});

// Function to remove selected disease
function removeDisease() {
  selectedDisease = "";
  const el = document.getElementById("selected-disease-display");
  if (el) el.style.display = "none";
  localStorage.removeItem("selectedDisease");
}

// Add disease to savePrescription function: we'll later override savePrescription reference
// (we keep the original savePrescription below and will wrap if needed)

/* ---------- Prescription: save/clear/list UI ---------- */

// Function to clear prescription data
function clearPrescription() {
  selectedMedicines = [];
  selectedTests = [];
  const sm = document.getElementById("selected-medicines");
  const st = document.getElementById("selected-tests");
  if (sm) sm.innerHTML = "";
  if (st) st.innerHTML = "";
}

// Function to save prescription data to localStorage
function savePrescription() {
  // Save medicines and tests
  localStorage.setItem("prescribedMedicines", JSON.stringify(selectedMedicines));
  localStorage.setItem("prescribedTests", JSON.stringify(selectedTests));

  // Save remarks
  const remarksEl = document.getElementById("patient-remarks");
  if (remarksEl) {
    patientRemarks = remarksEl.value;
    localStorage.setItem("patientRemarks", patientRemarks);
  }

  // Also save disease (ensure persistence)
  if (selectedDisease && selectedDisease !== "") {
    localStorage.setItem("selectedDisease", selectedDisease);
  }

  alert("Prescription and remarks have been saved!");
}

// Function to show medicine list when search bar is clicked
function showMedicineList() {
  const ml = document.getElementById("medicine-list");
  if (!ml) return;
  ml.style.display = "block";
  if (ml.children.length === 0) {
    searchMedicines();
  }
}

// Function to show test list when search bar is clicked
function showTestList() {
  const tl = document.getElementById("test-list");
  if (!tl) return;
  tl.style.display = "block";
  if (tl.children.length === 0) {
    searchTests();
  }
}

// Function to toggle details display
function toggleDetails(id) {
  const details = document.getElementById(id);
  if (!details) return;
  if (details.style.display === "block") {
    details.style.display = "none";
  } else {
    details.style.display = "block";
  }
}

// Function to add medicine to selected list
function addMedicine(name, durationId, quantityId) {
  const durationEl = document.getElementById(durationId);
  const quantityEl = document.getElementById(quantityId);

  const duration = durationEl ? durationEl.value || "Not specified" : "Not specified";
  const quantity = quantityEl ? quantityEl.value || "Not specified" : "Not specified";

  const medicineElement = document.createElement("div");
  medicineElement.className = "medicine-item";
  medicineElement.innerHTML = `
    <strong>${name}</strong><br>
    Duration: ${duration}<br>
    Quantity: ${quantity}
    <button onclick="removeMedicine('${name}')" style="margin-left: 10px; background-color: #ff3366; color: white; border: none; border-radius: 3px; padding: 2px 5px;">Remove</button>
  `;

  const container = document.getElementById("selected-medicines");
  if (container) container.appendChild(medicineElement);

  // Store in the array
  selectedMedicines.push({
    name: name,
    duration: duration,
    quantity: quantity,
  });

  // Clear inputs
  if (durationEl) durationEl.value = "";
  if (quantityEl) quantityEl.value = "";
}

// Function to remove medicine from selected list
function removeMedicine(name) {
  selectedMedicines = selectedMedicines.filter(
    (medicine) => medicine.name !== name
  );

  // Update display
  const container = document.getElementById("selected-medicines");
  if (container) container.innerHTML = "";
  selectedMedicines.forEach((medicine) => {
    const medicineElement = document.createElement("div");
    medicineElement.className = "medicine-item";
    medicineElement.innerHTML = `
      <strong>${medicine.name}</strong><br>
      Duration: ${medicine.duration}<br>
      Quantity: ${medicine.quantity}
      <button onclick="removeMedicine('${medicine.name}')" style="margin-left: 10px; background-color: #ff3366; color: white; border: none; border-radius: 3px; padding: 2px 5px;">Remove</button>
    `;
    if (container) container.appendChild(medicineElement);
  });
}

// Function to add test to selected list
function addTest(name) {
  const testElement = document.createElement("div");
  testElement.className = "test-item";
  testElement.innerHTML = `
    <strong>${name}</strong>
    <button onclick="removeTest('${name}')" style="margin-left: 10px; background-color: #ff3366; color: white; border: none; border-radius: 3px; padding: 2px 5px;">Remove</button>
  `;

  const container = document.getElementById("selected-tests");
  if (container) container.appendChild(testElement);

  // Store in the array
  selectedTests.push(name);
}

// Function to remove test from selected list
function removeTest(name) {
  selectedTests = selectedTests.filter((test) => test !== name);

  // Update display
  const container = document.getElementById("selected-tests");
  if (container) container.innerHTML = "";
  selectedTests.forEach((test) => {
    const testElement = document.createElement("div");
    testElement.className = "test-item";
    testElement.innerHTML = `
      <strong>${test}</strong>
      <button onclick="removeTest('${test}')" style="margin-left: 10px; background-color: #ff3366; color: white; border: none; border-radius: 3px; padding: 2px 5px;">Remove</button>
    `;
    if (container) container.appendChild(testElement);
  });
}

// Function to search medicines
function searchMedicines() {
  const searchInput = document.getElementById("medicine-search");
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
  const medicineList = document.getElementById("medicine-list");

  if (!medicineList) return;

  // Clear current list
  medicineList.innerHTML = "";

  // Filter and add matching medicines
  let counter = 1;
  medicineDatabase
    .filter((medicine) => medicine.toLowerCase().includes(searchTerm))
    .forEach((medicine) => {
      const id = `search-medicine-${counter}`;

      const itemDiv = document.createElement("div");
      itemDiv.className = "item";
      itemDiv.innerHTML = `
        <span>${counter}. ${medicine}</span>
        <div class="checkbox" onclick="toggleDetails('${id}')"></div>
      `;

      const detailsDiv = document.createElement("div");
      detailsDiv.className = "medicine-details";
      detailsDiv.id = id;
      detailsDiv.innerHTML = `
        <input type="text" class="input-field" placeholder="Days" id="duration-${id}">
        <input type="text" class="input-field" placeholder="Quantity" id="quantity-${id}">
        <button onclick="addMedicine('${medicine}', 'duration-${id}', 'quantity-${id}')" style="background-color: #3366ff; color: white; border: none; padding: 5px 10px; border-radius: 3px; margin-top: 5px;">Add</button>
      `;

      medicineList.appendChild(itemDiv);
      medicineList.appendChild(detailsDiv);

      counter++;
    });
}

// Function to search tests
function searchTests() {
  const searchInput = document.getElementById("test-search");
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
  const testList = document.getElementById("test-list");

  if (!testList) return;

  // Clear current list
  testList.innerHTML = "";

  // Filter and add matching tests
  let counter = 1;
  testDatabase
    .filter((test) => test.toLowerCase().includes(searchTerm))
    .forEach((test) => {
      const id = `search-test-${counter}`;

      const itemDiv = document.createElement("div");
      itemDiv.className = "item";
      itemDiv.innerHTML = `
        <span>${counter}. ${test}</span>
        <div class="checkbox" onclick="toggleDetails('${id}')"></div>
      `;

      const detailsDiv = document.createElement("div");
      detailsDiv.className = "medicine-details";
      detailsDiv.id = id;
      detailsDiv.innerHTML = `
        <button onclick="addTest('${test}')" style="background-color: #3366ff; color: white; border: none; padding: 5px 10px; border-radius: 3px; margin-top: 5px;">Add</button>
      `;

      testList.appendChild(itemDiv);
      testList.appendChild(detailsDiv);

      counter++;
    });
}

/* Close lists when clicking outside */
document.addEventListener("click", function (event) {
  const medicineSearch = document.getElementById("medicine-search");
  const testSearch = document.getElementById("test-search");
  const medicineList = document.getElementById("medicine-list");
  const testList = document.getElementById("test-list");

  if (
    medicineList &&
    testList &&
    event.target !== medicineSearch &&
    !medicineList.contains(event.target) &&
    event.target !== testSearch &&
    !testList.contains(event.target)
  ) {
    medicineList.style.display = "none";
    testList.style.display = "none";
  }
});

/* History button PDF modal (kept as-is) */
const historyButton = document.getElementById("history-button");
if (historyButton) {
  historyButton.addEventListener("click", function () {
    const downloadedWebpage = localStorage.getItem("downloadedWebpage");

    if (downloadedWebpage) {
      const webpageData = JSON.parse(downloadedWebpage);

      const modalContent = `
      <div id="pdf-modal" style="
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
        background: rgba(0,0,0,0.9); 
        z-index: 1000; 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
      ">
        <div style="
          background: white; 
          width: 90%; 
          height: 90%; 
          display: flex; 
          flex-direction: column; 
          border-radius: 10px; 
          overflow: hidden;
        ">
          <div style="
            background-color: #3366ff; 
            color: white; 
            padding: 15px; 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
          ">
            <h2 style="margin: 0;">Medical History</h2>
            <button onclick="document.getElementById('pdf-modal').remove()" style="
              background-color: #ff3366; 
              color: white; 
              border: none; 
              border-radius: 5px; 
              padding: 10px 15px; 
              cursor: pointer;
            ">Close</button>
          </div>
          
          <iframe 
            src="${webpageData.url}" 
            style="
              flex-grow: 1; 
              width: 100%;  
              border: none; 
              background-color: #f0f0f0;
            "
          ></iframe>
        </div>
      </div>
    `;

      document.body.insertAdjacentHTML("beforeend", modalContent);
    } else {
      alert("No medical history found. Please scan a QR code first.");
    }
  });
}

/* -----------------------------
   Friend's WebRTC + Socket.io Code
   (renamed init → initWebRTC to avoid collision)
   -----------------------------*/

// WebRTC Configuration
const configuration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

// Socket.io connection
const socket = io();

// Global variables for WebRTC
let localStream = null;
let remoteStream = null;
let peerConnections = new Map(); // For multiple peers
let currentRoom = null;
let isVideoEnabled = true;
let isAudioEnabled = true;

// DOM elements for WebRTC — lazily resolved
const lobby = document.getElementById("lobby");
const videoChat = document.getElementById("videoChat");
const localVideo = document.getElementById("localVideo") || document.getElementById("userVideo");
const remoteVideo = document.getElementById("remoteVideo");
const remotePlaceholder = document.getElementById("remotePlaceholder");
const connectionStatus = document.getElementById("connectionStatus");
const roomInput = document.getElementById("roomInput");
const myRoomIdDisplay = document.getElementById("myRoomId");

// Initialize the WebRTC application (renamed)
async function initWebRTC() {
  try {
    // Get user media
    localStream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 },
      audio: true,
    });

    // Map userStream to localStream so prescription UI controls can use it
    userStream = localStream;

    if (localVideo) {
      localVideo.srcObject = localStream;
    }
    console.log("Local stream initialized");

    setupSocketListeners();

    // Wire up mute/video buttons from prescription UI (if present)
    const muteButton = document.getElementById("muteButton") || document.getElementById("toggleAudio");
    const videoButton = document.getElementById("videoButton") || document.getElementById("toggleVideo");

    if (muteButton) {
      muteButton.addEventListener("click", function () {
        if (!userStream) return;
        isAudioMuted = !isAudioMuted;
        userStream.getAudioTracks().forEach((track) => {
          track.enabled = !isAudioMuted;
        });
        // Keep button icon consistent
        muteButton.innerText = isAudioMuted ? "🔇" : "🎤";
        // Also reflect in friend UI toggle if present
        const toggleAudioBtn = document.getElementById("toggleAudio");
        if (toggleAudioBtn) {
          toggleAudioBtn.classList.toggle("muted", isAudioMuted);
        }
      });
    }

    if (videoButton) {
      videoButton.addEventListener("click", function () {
        if (!userStream) return;
        isVideoOff = !isVideoOff;
        userStream.getVideoTracks().forEach((track) => {
          track.enabled = !isVideoOff;
        });
        videoButton.innerText = isVideoOff ? "🚫" : "📹";
        const toggleVideoBtn = document.getElementById("toggleVideo");
        if (toggleVideoBtn) {
          toggleVideoBtn.classList.toggle("muted", isVideoOff);
        }
      });
    }
  } catch (error) {
    console.error("Error accessing media devices:", error);
    if (connectionStatus) updateStatus("Failed to access camera/microphone", "disconnected");
  }
}

// Setup Socket.io event listeners
function setupSocketListeners() {
  socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
  });

  socket.on("user-joined", async (userId) => {
    console.log("User joined room:", userId);
    updateStatus("Peer joined, establishing connection...", "connecting");
    await createPeerConnection(userId, true);
  });

  socket.on("existing-users", async (users) => {
    console.log("Found existing users in room:", users);
    if (users.length > 0) {
      updateStatus("Found peer, establishing connection...", "connecting");
      for (const userId of users) {
        await createPeerConnection(userId, false);
      }
    } else {
      updateStatus("Waiting for peer to join...", "connecting");
    }
  });

  socket.on("offer", async (data) => {
    console.log("Received offer from:", data.sender);
    await handleOffer(data.offer, data.sender);
  });

  socket.on("answer", async (data) => {
    console.log("Received answer from:", data.sender);
    await handleAnswer(data.answer, data.sender);
  });

  socket.on("ice-candidate", async (data) => {
    console.log("Received ICE candidate from:", data.sender);
    await handleIceCandidate(data.candidate, data.sender);
  });

  socket.on("user-left", (userId) => {
    console.log("User left room:", userId);
    handlePeerLeave(userId);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
    updateStatus("Disconnected from server", "disconnected");
  });
}

// Join an existing room (simple main-room logic kept)
function joinRoom() {
  currentRoom = "main-room";
  console.log("Joining room:", currentRoom);
  joinRoomSocket();
  showVideoChat();
  updateStatus("Connecting to room...", "connecting");
}

// Join room via Socket.io
function joinRoomSocket() {
  socket.emit("join-room");
}

// Create peer connection
async function createPeerConnection(userId, shouldCreateOffer) {
  console.log(`Creating peer connection with ${userId}, shouldCreateOffer: ${shouldCreateOffer}`);

  const peerConnection = new RTCPeerConnection(configuration);
  peerConnections.set(userId, peerConnection);

  // Add local stream tracks
  if (localStream) {
    localStream.getTracks().forEach((track) => {
      console.log("Adding track to peer connection:", track.kind);
      peerConnection.addTrack(track, localStream);
    });
  }

  // Handle remote stream
  peerConnection.ontrack = (event) => {
    console.log("Received remote track from:", userId, event.streams[0]);
    remoteStream = event.streams[0];
    if (remoteVideo) remoteVideo.srcObject = remoteStream;
    if (remotePlaceholder) remotePlaceholder.style.display = "none";
    if (remoteVideo) remoteVideo.style.display = "block";
    updateStatus("Connected to peer!", "connected");
  };

  // Handle ICE candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("Sending ICE candidate to:", userId);
      socket.emit("ice-candidate", {
        candidate: event.candidate,
        target: userId,
      });
    }
  };

  // Handle connection state changes
  peerConnection.onconnectionstatechange = () => {
    console.log("Connection state with", userId, ":", peerConnection.connectionState);

    switch (peerConnection.connectionState) {
      case "connected":
        updateStatus("Connected to peer!", "connected");
        break;
      case "disconnected":
        updateStatus("Peer disconnected", "disconnected");
        break;
      case "failed":
        updateStatus("Connection failed", "disconnected");
        handlePeerLeave(userId);
        break;
      case "connecting":
        updateStatus("Connecting to peer...", "connecting");
        break;
    }
  };

  // Handle ICE connection state
  peerConnection.oniceconnectionstatechange = () => {
    console.log("ICE connection state with", userId, ":", peerConnection.iceConnectionState);
  };

  // Create offer if this peer should initiate
  if (shouldCreateOffer) {
    console.log("Creating offer for:", userId);
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      socket.emit("offer", {
        offer: offer,
        target: userId,
      });
      console.log("Offer sent to:", userId);
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  }

  return peerConnection;
}

// Handle received offer
async function handleOffer(offer, senderId) {
  console.log("Handling offer from:", senderId);
  let peerConnection = peerConnections.get(senderId);

  if (!peerConnection) {
    console.log("Creating new peer connection for offer from:", senderId);
    peerConnection = await createPeerConnection(senderId, false);
  }

  try {
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit("answer", {
      answer: answer,
      target: senderId,
    });
    console.log("Answer sent to:", senderId);
  } catch (error) {
    console.error("Error handling offer:", error);
  }
}

// Handle received answer
async function handleAnswer(answer, senderId) {
  console.log("Handling answer from:", senderId);
  const peerConnection = peerConnections.get(senderId);
  if (peerConnection) {
    try {
      await peerConnection.setRemoteDescription(answer);
      console.log("Remote description set for:", senderId);
    } catch (error) {
      console.error("Error handling answer:", error);
    }
  }
}

// Handle ICE candidate
async function handleIceCandidate(candidate, senderId) {
  console.log("Handling ICE candidate from:", senderId);
  const peerConnection = peerConnections.get(senderId);
  if (peerConnection) {
    try {
      await peerConnection.addIceCandidate(candidate);
      console.log("ICE candidate added for:", senderId);
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
    }
  }
}

// Handle peer leaving
function handlePeerLeave(userId) {
  console.log("Handling peer leave:", userId);
  const peerConnection = peerConnections.get(userId);
  if (peerConnection) {
    peerConnection.close();
    peerConnections.delete(userId);
  }

  // If this was the only peer, reset the UI
  if (peerConnections.size === 0) {
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      remoteStream = null;
    }

    if (remoteVideo) remoteVideo.srcObject = null;
    if (remoteVideo) remoteVideo.style.display = "none";
    if (remotePlaceholder) remotePlaceholder.style.display = "flex";
    updateStatus("Waiting for peer to join...", "connecting");
  }
}

function showVideoChat() {
  if (lobby) lobby.classList.add("hidden");
  if (videoChat) videoChat.style.display = "block";
}

function showLobby() {
  if (lobby) lobby.classList.remove("hidden");
  if (videoChat) videoChat.style.display = "none";
  if (myRoomIdDisplay) myRoomIdDisplay.textContent = "";
  if (roomInput) roomInput.value = "";
}

function updateStatus(message, type) {
  if (connectionStatus) {
    connectionStatus.textContent = message;
    connectionStatus.className = `status ${type}`;
  }
}

// Control functions
function toggleVideo() {
  if (localStream) {
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      isVideoEnabled = videoTrack.enabled;

      const button = document.getElementById("toggleVideo");
      if (button) {
        button.classList.toggle("muted", !isVideoEnabled);
        button.textContent = isVideoEnabled ? "📹" : "📹";
        button.style.background = isVideoEnabled ? "rgba(255, 255, 255, 0.2)" : "#f44336";
      }
    }
  }
}

function toggleAudio() {
  if (localStream) {
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      isAudioEnabled = audioTrack.enabled;

      const button = document.getElementById("toggleAudio");
      if (button) {
        button.classList.toggle("muted", !isAudioEnabled);
        button.textContent = isAudioEnabled ? "🎤" : "🎤";
        button.style.background = isAudioEnabled ? "rgba(255, 255, 255, 0.2)" : "#f44336";
      }
    }
  }
}

function endCall() {
  // Leave room via socket
  socket.emit("leave-room");

  // Clean up all peer connections
  for (const [userId, peerConnection] of peerConnections) {
    peerConnection.close();
  }
  peerConnections.clear();

  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
  }

  if (remoteStream) {
    remoteStream.getTracks().forEach((track) => track.stop());
  }

  // Reset UI
  showLobby();
  updateStatus("Disconnected", "disconnected");

  // Reinitialize
  initWebRTC();
}

// Event listeners
const toggleVideoBtn = document.getElementById("toggleVideo");
if (toggleVideoBtn) toggleVideoBtn.addEventListener("click", toggleVideo);

const toggleAudioBtn = document.getElementById("toggleAudio");
if (toggleAudioBtn) toggleAudioBtn.addEventListener("click", toggleAudio);

const endCallBtn = document.getElementById("endCall");
if (endCallBtn) endCallBtn.addEventListener("click", endCall);

// Clean up when page unloads
window.addEventListener("beforeunload", () => {
  socket.emit("leave-room");
});

/* -----------------------------
   Application bootstrap (single place)
   Loads prescription localStorage values, clears prescription, and starts WebRTC
   -----------------------------*/

window.addEventListener("load", async function () {
  // Clear previous prescription data when the page loads
  clearPrescription();

  // Check for any existing remarks in localStorage
  const existingRemarks = localStorage.getItem("patientRemarks");
  if (existingRemarks) {
    const remarksEl = document.getElementById("patient-remarks");
    if (remarksEl) remarksEl.value = existingRemarks;
    patientRemarks = existingRemarks;
  }

  // Restore previously selected disease if present
  const existingDisease = localStorage.getItem("selectedDisease");
  if (existingDisease) {
    selectedDisease = existingDisease;
    const selectedDiseaseDisplay = document.getElementById("selected-disease-display");
    if (selectedDiseaseDisplay) {
      selectedDiseaseDisplay.style.display = "block";
      selectedDiseaseDisplay.innerHTML = `
        <span class="selected-disease">${selectedDisease}</span>
        <button class="remove-disease" onclick="removeDisease()">Remove</button>
      `;
    }
  }

  // Start WebRTC (this will set userStream/localStream and wire up mute/video buttons)
  await initWebRTC();
});
