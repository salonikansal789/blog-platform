📝 Blog Platform

A full-stack blog platform built with React , Node.js + Express + TypeScript (Backend), and MongoDB Atlas (Database).
The app is fully containerized using Docker and can be run with docker run or docker-compose.

🚀 Features

✍️ Add Post – create new blog posts with title, content, and tags

✏️ Edit Post – update existing blog posts

👍 Like Post – like functionality with counter

💬 Comments & Replies – nested comment system

📜 Post List with Pagination – view all posts in pages

🔍 Search Posts – search by keyword (Enter key or Search button)

🏷️ Filter by Tags – filter posts by categories/tags

👁️ View Post – read full post details

🛠️ Tech Stack

Frontend: React  + Nginx (Dockerized)

Backend: Node.js + Express + TypeScript (Dockerized)

Database: MongoDB Atlas (Cloud Database)

Deployment: Docker & Docker Compose

⚙️ Installation & Running

1️⃣ Run via Docker directly

# Pull frontend & backend images
Frontend :  docker pull salonidev/assignment-main-frontend:latest

Backend:  docker pull salonidev/assignment-main-backend:latest

# Run containers
Frontend:  docker run -p 3000:80 -d salonidev/assignment-main-frontend:latest

Backend:  docker run -p 3001:3001 -d salonidev/assignment-main-backend:latest

Frontend → http://localhost:3000

Backend → http://localhost:3001



🗄️ Database Setup

The backend connects to MongoDB Atlas.

You must set the MONGODB_URI in your backend .env file

