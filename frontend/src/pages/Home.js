import React from "react";
import { useNavigate } from "react-router-dom";
import './style/HomePage.css'; // Import custom CSS for styling

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1 className="home-title">Welcome to PlantXBlox</h1>
            <div className="grid-container">
                <div className="grid-item" onClick={() => navigate("/mainpage")}>
                    <h2>Blox Fruit Main</h2>
                </div>
                <div className="grid-item" onClick={() => navigate("/store")}>
                    <h2>Blox Fruit Random</h2>
                </div>
                <div className="grid-item coming-soon">
                    <h2>Fish Random</h2>
                    <p>Coming Soon</p>
                </div>
                <div className="broadcast-group">
                    <div className="broadcast-item">
                        <h3>User Visits</h3>
                        <p>1,234</p>
                    </div>
                    <div className="broadcast-item">
                        <h3>In-Stock Amount</h3>
                        <p>567</p>
                    </div>
                    <div className="broadcast-item">
                        <h3>Sold Out Amount</h3>
                        <p>89</p>
                    </div>
                    <div className="broadcast-item">
                        <h3>Product Amount</h3>
                        <p>123</p>
                    </div>
                </div>
                <div className="telegram-group">
                    <div className="telegram-item">
                        <a href="https://t.me/channel1" className="telegram-link">Telegram Channel 1</a>
                    </div>
                    <div className="telegram-item">
                        <a href="https://t.me/channel2" className="telegram-link">Telegram Channel 2</a>
                    </div>
                </div>
            </div>
            <footer className="footer">
                <p>Made by TengenSama</p>
            </footer>
        </div>
    );
};

export default Home;