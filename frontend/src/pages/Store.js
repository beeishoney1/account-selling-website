import React, { useEffect, useState } from "react";
import './style/Store.css'; // Import custom CSS for styling

import leopardImg from "../Img/stock1.jpg";
import yetiImg from "../Img/stock2.jpg";
import GasImg from "../Img/stock4.jpg";
import KitImg from "../Img/stock3.jpg";
import DoughImg from "../Img/stock5.jpg";

const imageMap = {
    "Leopard": leopardImg,
    "Yeti": yetiImg,
    "Gas": GasImg,
    "GasOrKit": KitImg,
    "Dough": DoughImg
};

const Store = () => {
    const [stocks, setStocks] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAmount, setSelectedAmount] = useState(1);

    // ✅ Fetch available stocks from the backend
    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/stocks");

                if (!response.ok) {
                    throw new Error("Failed to fetch stocks");
                }

                const data = await response.json();
                setStocks(data);
            } catch (error) {
                console.error("❌ Error fetching stocks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStocks();
        fetchAccounts(); // ✅ Fetch accounts when the page loads
    }, []);

    // ✅ Fetch available accounts
    const fetchAccounts = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("❌ No token found. User must log in.");
                return;
            }

            console.log("🔍 Fetching accounts with token:", token);

            const response = await fetch("http://localhost:5000/api/accounts", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch accounts: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("✅ Accounts fetched:", data);
            setAccounts(data);
        } catch (error) {
            console.error("❌ Error fetching accounts:", error.message);
        }
    };

    // ✅ Handle Buy Function with Amount Selection
    const handleBuy = async (stock, selectedAmount) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
    
        if (!token) {
            console.error("❌ No token found. User must be logged in.");
            alert("Login required. Please log in first.");
            return;
        }
    
        if (!user?.id) {
            console.error("❌ No user ID found.");
            alert("Invalid user session. Please log in again.");
            return;
        }
    
        if (!selectedAmount || selectedAmount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
    
        // ✅ Get available accounts for this stock
        const availableAccounts = accounts.filter(acc => acc.stock_id === stock.id && acc.is_sold === 0);
    
        if (availableAccounts.length === 0) {
            alert(`No available accounts for stock: ${stock.id}`);
            return;
        }
    
        if (selectedAmount > availableAccounts.length) {
            alert(`Not enough available accounts. Only ${availableAccounts.length} left.`);
            return;
        }
    
        // ✅ Select the correct number of accounts
        const selectedAccounts = availableAccounts.slice(0, selectedAmount);
        const selectedAccountIDs = selectedAccounts.map(acc => acc.id);
    
        const requestData = {
            userId: user.id,
            stockId: stock.id,
            accountIDs: selectedAccountIDs, // ✅ Send array correctly
            price: stock.price * selectedAmount,
        };
    
        console.log("📤 Sending request to buy stock:", requestData);
    
        try {
            const response = await fetch("http://localhost:5000/api/buy", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestData),
            });
    
            const data = await response.json();
            console.log("🔹 Server Response:", data);
    
            if (!response.ok) {
                throw new Error(data.msg || "Purchase failed");
            }
    
            alert(`✅ Successfully purchased ${selectedAmount} accounts!`);
            fetchAccounts();
        } catch (error) {
            console.error("❌ Error buying stock:", error);
            alert(error.message);
        }
    };
    
    return (
        <div className="store-container">
            <h1 className="store-title">Stock Random</h1>

            {loading ? (
                <p>Loading stocks...</p>
            ) : stocks.length === 0 ? (
                <p>No stocks available.</p>
            ) : (
                <ul className="stock-list">
                    {stocks.map((stock) => (
                        <div key={stock.id} className="stock-item">
                            <img 
                                src={imageMap[stock.name]} 
                                alt={stock.name} 
                                className="stock-image" 
                            />   
                            <h3>{stock.name}</h3>
                            <p>Price: {stock.price} Coins</p>
                            <p>Available Accounts: {accounts.filter(acc => acc.stock_id === stock.id && acc.is_sold === 0).length}</p>
                            <label>Amount to Buy:</label>
                            <input 
                                type="number" 
                                min="1" 
                                max={accounts.filter(acc => acc.stock_id === stock.id && acc.is_sold === 0).length} 
                                value={selectedAmount} 
                                onChange={(e) => setSelectedAmount(parseInt(e.target.value) || 1)}
                                className="amount-input"
                            />
                            <button onClick={() => handleBuy(stock, selectedAmount)} className="buy-button">Buy</button>
                        </div>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Store;