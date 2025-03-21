import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import './style/AdminDashboard.css'; // Import custom CSS for styling

const AdminDashboard = () => {
  console.log("Admin Token:", localStorage.getItem("token")); // Debugging
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [stocks, setStocks] = useState([]);
  const [selectedStockId, setSelectedStockId] = useState("");
  const [accountData, setAccountData] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token"); // Admin authentication token

  useEffect(() => {
    fetchUsers();
    fetchStocks();
    fetchAccounts();
  }, []);

  // ✅ Fetch Users for Admin Management
  const fetchUsers = async () => {
    setLoading(true);
    if (!token) {
      alert("You must be logged in as an admin.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Available Stocks
  const fetchStocks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/stocks");
      setStocks(response.data);
    } catch (error) {
      console.error("❌ Error fetching stocks:", error);
    }
  };

  // ✅ Fetch Accounts for Stocks
  const fetchAccounts = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ No token found. Admin must log in.");
            return;
        }

        console.log("🔍 Fetching accounts...");
        const response = await axios.get("http://localhost:5000/api/accounts", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        // ✅ Filter out removed accounts
        const filteredAccounts = response.data.filter(acc => acc.is_sold !== 2);

        console.log("✅ Accounts fetched:", filteredAccounts);
        setAccounts(filteredAccounts);
    } catch (error) {
        console.error("❌ Error fetching accounts:", error.message);
    }
};


  // ✅ Add New Account to Stock Type
  const handleAddAccount = async (event) => {
    event.preventDefault();

    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        if (!selectedStockId || !accountData) {
            alert("Please select a stock and enter account details.");
            return;
        }

        const requestData = {
            stock_id: selectedStockId,
            account_data: accountData.trim(), // ✅ Remove any unwanted spaces
        };

        console.log("📤 Sending account data:", requestData);

        const response = await axios.post("http://localhost:5000/api/accounts", requestData, { 
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("✅ Account added:", response.data);
        fetchAccounts(); // Refresh the account list
        setAccountData(""); // Clear input field
    } catch (error) {
        console.error("❌ Error adding account:", error.response?.data || error.message);
        alert("Failed to add account. Check console for details.");
    }
};


  // ✅ Remove an Account
  const handleRemoveAccount = async (accountId) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ No token found. Admin must log in.");
            return;
        }

        console.log(`🗑 Removing account ID: ${accountId}`);

        // ✅ Update the account to mark it as removed instead of deleting
        await axios.post(`http://localhost:5000/api/admin/remove-account`, 
            { accountId },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("✅ Account removed from Admin Panel.");
        setAccounts(accounts.filter(acc => acc.id !== accountId)); // ✅ Remove from admin view
    } catch (error) {
        console.error("❌ Error removing account:", error.message);
    }
};


  // ✅ Add Coins to User (Custom Amount)
  const handleAddCoins = async () => {
    if (!selectedUserId || !amount) {
      alert("Please select a user and enter an amount.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/add-coins",
        { userId: selectedUserId, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.msg);
      fetchUsers();
      setAmount(""); // Clear input field after adding
    } catch (error) {
      console.error("❌ Error adding coins:", error.response?.data?.msg || error.message);
    }
  };

  // ✅ Remove Coins from User (Custom Amount)
  const handleRemoveCoins = async () => {
    if (!selectedUserId || !amount) {
      alert("Please select a user and enter an amount.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/remove-coins",
        { userId: selectedUserId, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.msg);
      fetchUsers();
      setAmount(""); // Clear input field after removing
    } catch (error) {
      console.error("❌ Error removing coins:", error.response?.data?.msg || error.message);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h2 className="admin-dashboard-title">🛠 Admin Dashboard</h2>

      {/* 🔹 Single Coin Management Section */}
      <h3 className="section-title">💰 Manage User Coins</h3>
      <select className="select-input" onChange={(e) => setSelectedUserId(e.target.value)} value={selectedUserId} required>
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.username} ({user.coins} Coins)
          </option>
        ))}
      </select>

      <input className="number-input" type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />

      <button className="action-button" onClick={handleAddCoins}>➕ Add Coins</button>
      <button className="action-button" onClick={handleRemoveCoins}>➖ Remove Coins</button>

      {/* 🔹 Add Account Section */}
      <h3 className="section-title">➕ Add New Account</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleAddAccount}>
        <select className="select-input" onChange={(e) => setSelectedStockId(e.target.value)} value={selectedStockId} required>
          <option value="">Select Stock</option>
          {stocks.map((stock) => (
            <option key={stock.id} value={stock.id}>
              {stock.name}
            </option>
          ))}
        </select>
        <input className="text-input" type="text" placeholder="Account Data (username:password)" value={accountData} onChange={(e) => setAccountData(e.target.value)} required />
        <button className="action-button" type="submit">Add Account</button>
      </form>

      {/* 🔹 Account Management Section */}
      <h3 className="section-title">📜 Account List</h3>
      <table className="accounts-table" border="1">
        <thead>
          <tr>
            <th>Stock ID</th>
            <th>Account Data</th>
            <th>Status</th>  {/* ✅ New column */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length === 0 ? (
            <tr>
              <td colSpan="4">No accounts available</td>
            </tr>
          ) : (
            accounts.map((acc) => (
              <tr key={acc.id}>
                <td>{acc.stock_id}</td>
                <td>{acc.account_data}</td>
                <td>{acc.stock_status}</td>  {/* ✅ Show stock status */}
                <td>
                  <button className="action-button" onClick={() => handleRemoveAccount(acc.id)}>❌ Remove</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;