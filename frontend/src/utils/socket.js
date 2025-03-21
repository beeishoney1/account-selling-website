import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Connect to backend

export default socket;
