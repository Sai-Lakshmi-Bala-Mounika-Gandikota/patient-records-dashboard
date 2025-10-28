import React from "react";
import PatientDashboard from "./components/PatientDashboard";

export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Patient Records Dashboard</h1>
      <PatientDashboard />
    </div>
  );
}
