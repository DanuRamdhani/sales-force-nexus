import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/style.css";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </main>
  );
}

export default App;