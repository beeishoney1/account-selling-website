import React, { useState, useEffect } from "react";
import { getUserInfo } from "../utils/api"; // Ensure this function is correctly defined to fetch user data from API
import './style/Dashboard.css'; // Import custom CSS for styling

const Dashboard = () => {
  const [user, setUser] = useState(null);  // State to store user data
  const [balance, setBalance] = useState(0);  // State to store user balance/coins
  const [loading, setLoading] = useState(true);  // State to manage loading state

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo();  // Fetch user data from the API
        setUser(data);  // Store user data
        setBalance(data.coins);  // Set the balance from the response data
        setLoading(false);  // Set loading to false when the data is fetched
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setLoading(false);  // Set loading to false in case of error as well
      }
    };

    fetchUserInfo();  // Call the function to fetch user info
  }, []);  // Empty dependency array ensures this runs only once when the component mounts

  if (loading) {
    return <p>Loading user info...</p>;  // Show loading message while data is being fetched
  }

  if (!user) {
    return <p>No user data available!</p>;  // Show a message if no user data is available
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome, {user.username}!</h1>  {/* Display username */}
      <p className="dashboard-balance">Your Balance: {balance} coins</p>  {/* Display user's balance/coins */}
    </div>
  );
};

export default Dashboard;