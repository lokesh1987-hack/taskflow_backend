📘 TaskFlow – Project Management App

TaskFlow is a full-stack project management application that helps users manage projects and todos efficiently. It includes authentication, project tracking, and task organization features.

🚀 Tech Stack

Frontend

React (Vite)
Axios
Tailwind CSS

Backend

Node.js
Express.js
MongoDB
JWT Authentication
⚙️ Run Project Locally

Follow these steps to start the project on your local machine.


1️⃣ Clone the Repository
git clone https://github.com/your-username/taskflow.git
cd taskflow
2️⃣ Setup Backend (Node Server)

Navigate to backend folder:

cd backend

Install dependencies:

npm install

Create .env file inside backend/ folder:

PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173

Start backend server:

npm run dev

OR

node server.js

Backend runs on:

http://localhost:5000
