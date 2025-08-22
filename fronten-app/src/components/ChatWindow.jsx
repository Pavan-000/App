import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./Chat.css";

const socket = io("http://localhost:5000");

function Chat({ userId }) {
  const [contacts, setContacts] = useState([]);
  const [current, setCurrent] = useState("");
  const [msg, setMsg] = useState("");
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    socket.emit("join", userId);
    socket.emit("getContacts", userId, setContacts);

    socket.on("receiveMessage", (m) => {
      if (m.senderId === current) setChatLog((prev) => [...prev, { ...m, self: false }]);
    });
  }, [userId, current]);

  const addContact = (id) => {
    socket.emit("addContact", { userId, contactId: id });
    setContacts((prev) => [...new Set([...prev, id])]);
  };

  const selectContact = (id) => {
    setCurrent(id);
    setChatLog([]);
    socket.emit("getMessages", { userId, contactId: id }, (msgs) => {
      setChatLog(msgs.map((m) => ({ message: m.message, self: m.sender_id === userId })));
    });
  };

  const sendMessage = () => {
    if (!current || !msg.trim()) return;
    const o = { senderId: userId, receiverId: current, message: msg };
    socket.emit("sendMessage", o);
    setChatLog((prev) => [...prev, { ...o, self: true }]);
    setMsg("");
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <h3>Contacts</h3>
        <input placeholder="Add contact" onKeyDown={(e) => e.key === "Enter" && addContact(e.target.value)} />
        <ul>{contacts.map((c) => (
          <li key={c}><button className={c === current ? 'active' : ''} onClick={() => selectContact(c)}>{c}</button></li>
        ))}</ul>
      </div>
      <div className="chat-window">
        {current ? (
          <>
            <h4>Chat with {current}</h4>
            <div className="messages">
              {chatLog.map((m,i) => <div key={i} className={m.self ? 'sent' : 'received'}>{m.message}</div>)}
            </div>
            <div className="input-box">
              <input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type message..." />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : <div className="no-contact">
          <p>Pick a contact to start your conversation 😊😊..</p> </div>}
      </div>
    </div>
  );
}

export default Chat;
