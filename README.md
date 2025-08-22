# Full-Stack Chat Application

A modern **real-time chat application** with a **Node.js + Express backend** and a **React (Vite) frontend**.  
The backend manages authentication, contacts, friends, and messaging APIs using Supabase, while the frontend provides a clean, responsive UI for users to chat seamlessly.

---

##  Tech Stack

### Backend
- **Node.js + Express.js** — REST API server
- **Supabase** — Database & authentication
- **JWT Authentication** — Secure user sessions
- **Custom Validators** — Request validation

### Frontend
- **React (Vite)** — Fast frontend framework
- **Supabase Client** — Auth & data connection
- **CSS Modules** — Component-level styling

---


---

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd <repo-folder>

2. Setup Backend
cd backend
npm install

Create a .env file in backend/ with the following variables:
PORT=5000
SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-anon-key>
JWT_SECRET=<your-secret-key>

Run the backend:
npm start
The backend will run on http://localhost:5000.

3. Setup Frontend
cd fronten-app
npm install
npm run dev
The frontend will run on http://localhost:5173.

API Endpoints
Auth
    POST /auth/register → Register a new user
    POST /auth/login → Login and get JWT token
Users
    GET /users/:id → Get user profile
    PUT /users/:id → Update user details
Contacts
    GET /contacts → Fetch user contacts
    POST /contacts → Add a new contact
Friends
    GET /friends → Get friends list
Messages
    GET /messages/:chatId → Fetch messages of a chat
    POST /messages → Send a new message

Workflow
1) Authentication
    User registers/logs in via frontend (Login.js).
    Backend (auth.js) verifies credentials and issues a JWT.
2) Contacts & Friends
     After login, frontend (Contacts.js) fetches data via contactRoutes.js and friends.js.
3) Messaging
    User selects a chat → ChatWindow.jsx communicates with backend messageRoutes.js.
    Messages stored/retrieved in Supabase through models & controllers.
4) UI Rendering
    React components (ChatWindow, Contacts, Login) dynamically update state & render chat interface.




