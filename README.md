# iPass — Password Manager

A full-stack password manager built with **React (Vite)** and an **Express + MongoDB** backend. Users register, log in, and manage their own private collection of website credentials — add, edit, delete, copy to clipboard, and toggle password visibility. Each user only sees their own saved passwords.

## Features

- **User authentication** — register and log in with JWT-based auth; passwords for accounts are hashed with bcrypt
- **Private vaults** — every user only sees and manages their own saved passwords
- **Save credentials** — store website URL, username, and password
- **Edit & delete** — update or remove any saved entry
- **Copy to clipboard** — one-click copy for site, username, or password
- **Show/hide password** — toggle password visibility with an eye icon
- **Toast notifications** — clean feedback on every action (react-toastify)
- **Responsive design** — works on desktop and mobile

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- react-toastify — notifications
- uuid — unique IDs
- Lordicon — animated icons

**Backend**
- Node.js + Express
- MongoDB (native driver)
- bcryptjs — password hashing
- jsonwebtoken (JWT) — authentication
- cors, dotenv

## Project Structure

```
iPass/
├── (frontend - React/Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   │       ├── navbar.jsx
│   │       ├── manager.jsx      # main password manager UI
│   │       ├── Login.jsx        # login / register page
│   │       └── footer.jsx
│   └── .env                     # VITE_API_URL (frontend)
│
└── (backend - Express)
    ├── server.js                # API: auth + password CRUD
    └── .env                     # MONGO_URI, DB_NAME, JWT_SECRET (backend)
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- A MongoDB database — local, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Backend setup

In the backend folder, create a `.env` file:
```
MONGO_URI=your_mongodb_connection_string
DB_NAME=ipass
JWT_SECRET=any_long_random_secret_string
```
Then install and run:
```bash
npm install
node server.js
```
The API runs on `http://localhost:3000`.

### 2. Frontend setup

In the React project folder, create a `.env` file:
```
VITE_API_URL=http://localhost:3000/
```
Then install and run:
```bash
npm install
npm run dev
```
Open the URL shown (usually `http://localhost:5173`).

## How It Works

- On **register**, the account password is hashed with bcrypt and stored in a `users` collection.
- On **login**, the server verifies the password and returns a **JWT token**, which the frontend stores.
- Every request to the password API includes the token; the server decodes it to identify the user and returns/saves only that user's passwords (each entry is tagged with a `userId`).

## Deployment

This project has a separate frontend and backend, so they deploy separately:
- **Frontend** → Vercel or Netlify (set `VITE_API_URL` to the deployed backend URL)
- **Backend** → Render or Railway (set `MONGO_URI`, `DB_NAME`, `JWT_SECRET`)
- **Database** → MongoDB Atlas

## Known Limitations / Future Improvements

- **Passwords are stored in plaintext in the database.** A production password manager would encrypt them at rest (e.g. AES-256), and ideally use client-side encryption with a user master password so the server never sees plaintext.
- Add password strength indicators and a generator
- Add search/filter for saved passwords
- Add HTTPS-only and secure cookie handling for tokens

## Author

**Shreshth Lohiya**
[@lohiyascode](https://github.com/lohiyascode)

## Acknowledgements

Built as a full-stack practice project to learn authentication (JWT + bcrypt), Express APIs, MongoDB, and building a multi-user application.
