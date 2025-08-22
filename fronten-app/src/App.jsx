import React, { useState } from "react";
import Chat from "./components/ChatWindow";
import "./App.css";

function App() {
  const [userId, setUserId] = useState("");
  const [joined, setJoined] = useState(false);
  return joined ? <Chat userId={userId} /> : (
    <div className="login-screen">
      <h2>Welcome to Chat App</h2>
      <input placeholder="Enter your ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
      <button disabled={!userId.trim()} onClick={() => setJoined(true)}>Join</button>
    </div>
  );
}

export default App;
