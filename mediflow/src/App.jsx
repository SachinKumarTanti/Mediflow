import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import Admin from "./pages/Admin";
import AddPatient from "./pages/AddPatient";
import PatientQueue from "./pages/PatientQueue";
import MedicineStock from "./pages/MedicineStock";
import UnderConstruction from "./pages/UnderConstruction";
import HomePage from "./pages/HomePage";


function App() {
  return (
    <Routes>

      <Route path="/login" element={<UserLogin />} />
      <Route path="/dashboard" element={<Admin />}/ >
      <Route path="/addpatient" element={<AddPatient />} />
      <Route path="/patientqueue" element={<PatientQueue />} />
      <Route path="/medicinestore" element={<MedicineStock/>} />
      <Route path="/underconstruction" element={<UnderConstruction/>} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;
