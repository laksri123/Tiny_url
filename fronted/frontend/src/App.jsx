// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import Stats from "./Stats";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stats/:code" element={<Stats />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
