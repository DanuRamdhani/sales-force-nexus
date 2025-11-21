import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/App.css";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LeadDetailPage from "./pages/LeadDetailPage.jsx";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <DashboardPage />
          }
        />
        <Route
          path="/leads/:leadId"
          element={
            <LeadDetailPage />
          }
        />
      </Routes>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;