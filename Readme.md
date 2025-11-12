# Vynce — Video Conferencing App

A lightweight video-conferencing web app (based on the repository in this workspace). Vynce includes a Node/Express backend with Socket.IO for real-time signalling and a React + Vite frontend that handles WebRTC peer connections, chat, screen sharing and basic meeting controls.

---

## Table of contents

- Project overview
- Project structure
- Features
- Technologies
- Backend overview
- APIs and routes
- Frontend overview
- Local setup and run instructions
- Notes and troubleshooting

---

## Project overview

Vynce is a simple yet practical video meeting application designed for small group calls and demos. It demonstrates how to wire together WebRTC for peer-to-peer media, Socket.IO for signalling, and a minimal user and meeting model on the server. The app focuses on a concise UX: join a meeting via ID/link, share camera/mic, chat, present your screen, view participants, and gracefully leave.

## Project structure

Top-level layout in the workspace (relevant folders):

- Backend/

  - app.js — Express server entry
  - package.json
  - config/db.js — DB connection (if used)
  - middleware/auth.js — authentication middleware
  - Models/
    - User.js
    - Meeting.js
  - routes/
    - meetingRoutes.js
    - userRoutes.js

- Frontend/
  - package.json
  - index.html
  - vite.config.js
  - public/ — static assets
  - src/
    - main.jsx — app bootstrap
    - App.jsx
    - pages/ — views like `MeetingRoom.jsx`, `CallEnded.jsx`, `Login.jsx`, `Register.jsx`
    - components/ — shared UI (Header, Footer, ProtectedRoute)
    - context/ — `AuthContext.jsx`
    - lib/ — helpers (socket initialization, api helpers)
    - services/ — frontend API wrappers (auth etc.)

## Features

- Join a meeting via ID / link
- Real-time video/audio using WebRTC
- Screen sharing (getDisplayMedia)
- Mute/unmute and camera on/off controls
- In-meeting text chat (Socket.IO)
- Participants list and basic media status indicators
- Copy invitation link to clipboard
- Responsive layout (desktop and mobile)

## Technologies

- Backend: Node.js, Express, Socket.IO
- Database (optionally): MongoDB or other, accessed via `config/db.js` (project scaffolding)
- Frontend: React, Vite, lucide-react icons
- WebRTC APIs: RTCPeerConnection, getUserMedia, getDisplayMedia
- Real-time signalling: Socket.IO

## Backend overview

The backend provides two main responsibilities:

1. User and meeting HTTP APIs (e.g., register, login, meeting creation or metadata).
2. Socket.IO signalling for WebRTC (join/leave, offer/answer, ICE candidates, chat messages, and media-state broadcasts).

Key server events used by the frontend:

- `join-meeting` — client announces they joined a meetingId (server should add socket to a room and broadcast presence)
- `user-joined` — server informs peers that a new participant joined (typically includes socketId and display name)
- `offer` / `answer` / `ice-candidate` — standard WebRTC signalling messages
- `chat-message` — sends/receives chat messages (server broadcasts in the meeting room)
- `media-state` — notify peers (muted/video off/screen sharing) updates
- `leave-meeting` / `user-left` — cleanup and inform peers

The server also validates authentication (if enabled) — see `middleware/auth.js` for token checks used during socket connection or HTTP requests.

## APIs and routes (why they exist)

- `POST /api/auth/register` — create a new user (simple account management)
- `POST /api/auth/login` — authenticate and issue a token or session
- `GET /api/meetings/:id` — (optional) fetch meeting metadata such as title, host, or settings

Why these APIs: they provide minimal necessary primitives for user/account handling and exposing meeting metadata that can be used to show meeting info, enforce host permissions, or persist meeting history.

Socket events (signalling + chat) were chosen because WebRTC requires a separate signalling channel to exchange SDP offers/answers and ICE candidates. Socket.IO is convenient because it supports rooms and reconnect behavior out of the box.

## Frontend overview

The frontend is a React app bootstrapped with Vite. Main responsibilities:

- Capture local media using getUserMedia and manage a local MediaStream
- Create and manage RTCPeerConnections for each remote participant
- Exchange SDP offers/answers and ICE candidates over Socket.IO
- Render video tiles and focused/presenting views
- Provide chat, participants list, and meeting controls

Key files of interest:

- `src/pages/MeetingRoom.jsx` — the main meeting UI; manages local stream, peers (peersRef), and socket events
- `src/lib/socket.js` — socket creation helper so the app can pass the auth token
- `src/context/AuthContext.jsx` — user context + token management used across components

## Local setup and run instructions

Prerequisites:

- Node.js 16+ (or current LTS)
- npm

Backend

1. Open a terminal and go to the Backend folder:

```powershell
cd .\Backend
npm install
```

2. Create environment variables (example `.env`):

- PORT=5000
- MONGO_URI=<your mongo url> (optional if database used)
- JWT_SECRET=<secret> (if auth is used)

3. Start the server (development):

```powershell
node app.js
```

Frontend

1. Open a new terminal and go to the Frontend folder:

```powershell
cd .\Frontend
npm install
```

2. Start the frontend dev server:

```powershell
npm run dev
```

3. Open your browser and navigate to the indicated Vite URL (usually `http://localhost:5173`).

Notes on running locally:

- Browsers require HTTPS or localhost to access getUserMedia in some contexts. Using `localhost` in development works; if you test cross-device, you'll need to host over a secure origin.
- Grant camera/microphone permissions when prompted — device labels and audio routing information are only available after granting permission.

## Common troubleshooting

- No video/audio: ensure you granted permissions and that another application is not blocking the device.
- `setSinkId` not working: only supported on some browsers (Chrome/Edge). Audio output routing may not be available in all browsers.
- NAT/Firewall issues: direct P2P connections may fail without STUN/TURN. The project includes a public STUN server (Google) but for robust connectivity in real-world deployments you'll want to set up a TURN server.

## Future improvements

- Add device selection UI (select microphone and speaker) and persist user preferences.
- Add a TURN server for more reliable connectivity across restrictive networks.
- Add tests and CI for both frontend and backend.
- Add recordings, meeting scheduling, moderator controls, and advanced role-based permissions.

---
