# NexFlow

A real-time team collaboration platform built with React, Node.js, Socket.io, and MongoDB. Channels, live messaging, Kanban task board, and workspace management — all in one minimal interface.

**Live Demo** · [github.com/tanujkinkar9/nexflow](https://github.com/tanujkinkar9/nexflow)

---

## Features

- **Real-time messaging** — Socket.io powered chat with message persistence
- **Multiple channels** — Create topic-based channels inside a workspace
- **Kanban task board** — Drag tasks across To Do, In Progress, and Done
- **Live presence** — See who's online with real-time green/grey indicators
- **Typing indicators** — Know when someone is responding
- **Workspaces** — Create a team workspace, invite members via a unique code
- **JWT authentication** — Secure login with bcrypt password hashing
- **Persistent history** — All messages stored in MongoDB, reload anytime

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router |
| Backend | Node.js, Express |
| Real-time | Socket.io |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs |

---

## Project Structure

```
nexflow/
├── client/                 # React frontend
│   └── src/
│       ├── pages/
│       │   ├── Landing.jsx       # Marketing landing page
│       │   ├── Login.jsx         # Authentication
│       │   ├── Register.jsx      # Registration
│       │   └── Dashboard.jsx     # Main app shell
│       ├── components/
│       │   ├── Sidebar.jsx       # Channels, members, presence
│       │   ├── ChatArea.jsx      # Real-time messaging
│       │   ├── TaskBoard.jsx     # Kanban board
│       │   └── WorkspaceSetup.jsx
│       └── context/
│           └── AuthContext.jsx   # Global auth state
└── server/                 # Express backend
    ├── models/             # Mongoose schemas
    ├── routes/             # REST API routes
    └── socket/             # Socket.io event handlers
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

### 1. Clone the repo
```bash
git clone https://github.com/tanujkinkar9/nexflow.git
cd nexflow
```

### 2. Setup the server
```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the server:
```bash
npm run dev
```

### 3. Setup the client
```bash
cd ../client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/workspaces` | Get user's workspaces |
| POST | `/api/workspaces` | Create a workspace |
| POST | `/api/workspaces/join` | Join via invite code |
| GET | `/api/channels/workspace/:id` | Get channels in workspace |
| POST | `/api/channels` | Create a channel |
| GET | `/api/tasks/workspace/:id` | Get tasks in workspace |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id/status` | Update task status |

---

## Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join_channel` | Client → Server | Join a channel room |
| `send_message` | Client → Server | Send a message |
| `new_message` | Server → Client | Receive a message |
| `message_history` | Server → Client | Load past messages |
| `typing_start` | Client → Server | User started typing |
| `user_typing` | Server → Client | Broadcast typing indicator |
| `join_workspace` | Client → Server | Join for presence tracking |
| `online_users` | Server → Client | Current online members |
| `task_updated` | Client → Server | Notify task status change |
| `task_changed` | Server → Client | Receive task update |

---

## Screenshots

> Landing page · Auth · Chat · Kanban board

---

## Author

**Tanuj Kinkar**
[github.com/tanujkinkar9](https://github.com/tanujkinkar9)

---

## License

MIT
