import { useState, useEffect } from "react";
import axios from "axios";
import './style/TransactionHistory.css'; // Import custom CSS for styling

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('All');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found");
                    return;
                }

                console.log("Fetching transactions...");
                const response = await axios.get("http://localhost:5000/api/transactions", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("✅ Transactions received:", response.data);
                setTransactions(response.data);
                setLoading(false);
            } catch (error) {
                console.error("❌ Error fetching transactions:", error);
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []); // ✅ Only runs ONCE when the component mounts

    // Get unique dates from transactions
    const uniqueDates = ['All', ...new Set(transactions.map(transaction => new Date(transaction.formatted_date).toLocaleDateString()))];

    // Filter transactions based on selected date
    const filteredTransactions = selectedDate === 'All' ? transactions : transactions.filter(transaction => new Date(transaction.formatted_date).toLocaleDateString() === selectedDate);

    return (
        <div className="transaction-history-container">
            <h2>Transaction History</h2>
            <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="date-filter-dropdown">
                {uniqueDates.map((date, index) => (
                    <option key={index} value={date}>{date}</option>
                ))}
            </select>
            {loading ? <p>Loading...</p> : (
                <div className="table-container">
                    <table className="transaction-table">
                        <thead>
                            <tr>
                                <th>Stock Name</th>
                                <th>Account Info</th>
                                <th>Price</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((transaction, index) => (
                                <tr key={transaction.id || index}>
                                    <td>{transaction.stock_name}</td>
                                    <td>{transaction.account_info}</td>
                                    <td>{transaction.price} Coins</td>
                                    <td>{new Date(transaction.formatted_date).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TransactionHistory;