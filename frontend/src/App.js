import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Store from "./pages/Store";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register"; // ✅ Import Register Page
import TransactionHistory from "./pages/TransactionHistory"; // ✅ Import Transaction History
import MainPage from './pages/MainPage';



function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get admin status from localStorage
    const adminStatus = localStorage.getItem("isAdmin");
    setIsAdmin(adminStatus === "true"); // Keeps original logic
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<TransactionHistory />} /> {/* ✅ Added Transactions Page */}
        <Route path="/mainpage" element={<MainPage />} />

        {/* Check admin status and conditionally render Admin Dashboard */}
        <Route
          path="/admindashboard"
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/dashboard" />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* ✅ Added Register Route */}
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
