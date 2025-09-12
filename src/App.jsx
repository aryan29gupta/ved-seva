import { BrowserRouter, Routes, Route } from "react-router-dom";
import Page from "./app/page";
import DoctorLoginPage from "./app/DoctorLogin";
import PatientLoginPage from "./app/PatientLogin";
import NurseLoginPage from "./app/NurseLogin";
import NGOLoginPage from "./app/NGOLogin";
import DoctorProfileDashboard from "./app/DoctorProfile";
import VedsevaPatientProfile from "./app/PatientProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/doctor-login" element={<DoctorLoginPage />} />
        <Route path="/patient-login" element={<PatientLoginPage />} />
        <Route path="/nurse-login" element={<NurseLoginPage />} />
        <Route path="/ngo-login" element={<NGOLoginPage />} />
        <Route path="/doctor-profile" element={<DoctorProfileDashboard />} />
        <Route path="/patient-profile" element={<VedsevaPatientProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
