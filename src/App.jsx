import { BrowserRouter, Routes, Route } from "react-router-dom";
import Page from "./app/page";
import DoctorLoginPage from "./app/DoctorLogin";
import PatientLoginPage from "./app/PatientLogin";
import NurseLoginPage from "./app/NurseLogin";
import NGOLoginPage from "./app/NGOLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/doctor-login" element={<DoctorLoginPage />} />
        <Route path="/patient-login" element={<PatientLoginPage />} />
        <Route path="/nurse-login" element={<NurseLoginPage />} />
        <Route path="/ngo-login" element={<NGOLoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
