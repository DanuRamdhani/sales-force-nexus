import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/style.css";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </main>
  );
}

export default App;