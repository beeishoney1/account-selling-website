import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import custom CSS
import logo from "../Img/titlelogo.jpg"; // Import your logo image

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isNightMode, setIsNightMode] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.isAdmin || false;

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isNightMode ? 'night' : 'day');
    }, [isNightMode]);

    return (
        <nav className="navbar">
            <div className="navbar-brand" onClick={() => window.location.reload()}>
                <img src={logo} alt="PlantXBlox Logo" className="navbar-logo" />
                <span>PlantXBlox</span>
            </div>
            
            <ul className={`navbar-menu ${dropdownOpen ? "open" : ""}`}>
                <li><Link to="/" className="navbar-link">Home</Link></li>
                <li><Link to="/store" className="navbar-link">Store</Link></li>
                <li><Link to="/transactions" className="navbar-link">Transaction History</Link></li>
                <li><Link to="/register" className="navbar-link">📝 Register</Link></li>
                <li className="nav-item">
                    <Link to="/mainpage" className="navbar-link">Main Page</Link>
                </li>                
                {user ? (
                    <>
                        <li><Link to="/dashboard" className="navbar-link">Dashboard</Link></li>
                        {isAdmin && <li><Link to="/admindashboard" className="navbar-link">Admin Panel</Link></li>}
                        
                        <li className="navbar-link" onClick={() => {
                            localStorage.removeItem("user");
                            window.location.href = "/login";
                        }}>Logout</li>
                    </>
                ) : (
                    <li><Link to="/login" className="navbar-link">Login</Link></li>
                )}
                <li className="navbar-link mode-toggle" onClick={() => setIsNightMode(!isNightMode)}>
                    {isNightMode ? 'Light Mode' : 'Dark Mode'}
                </li>
            </ul>

            <button className="navbar-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
                ☰
            </button>
        </nav>
    );
};

export default Navbar;