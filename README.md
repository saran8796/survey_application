# Survey Application

A full-stack Survey Application built with React (Vite), Node.js, Express, and MongoDB.

## Features
- **User Authentication**: Register and Login securely (JWT).
- **Create Surveys**: Build surveys with short-answer and multiple-choice questions.
- **Take Surveys**: Publicly accessible links for users to fill out surveys.
- **Analytics Dashboard**: View results with visual charts (Bar charts).
- **Responsive Design**: Built with Tailwind CSS.

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, Chart.js
- Backend: Node.js, Express, MongoDB (Mongoose), JWT

## Prerequisites
- Node.js installed
- MongoDB installed and running locally (or update URI in `.env`)

## Setup & Installation

1. **Clone the repository** (if applicable)

2. **Backend Setup**
   ```bash
   cd server
   npm install
   # Create a .env file if not present:
   # PORT=5000
   # MONGO_URI=mongodb://localhost:27017/survey_app
   # JWT_SECRET=supersecretkey123
   node index.js
   ```
   The server runs on http://localhost:5000.

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   The client runs on http://localhost:5173.

## Usage
1. Open the client URL.
2. Register a new account.
3. Create a survey from the dashboard.
4. Share the "Take/Share" link (e.g., in an incognito window) to submit responses.
5. View results on the dashboard.
