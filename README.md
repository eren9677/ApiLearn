# QR Code Generator Web Application

A full-stack web application for generating, customizing, and managing QR codes. Built with FastAPI, React, and MySQL. Powered with Vite and dockerized for production.

## Features

- 🔐 User Authentication (Login/Signup)
- 🎨 Customizable QR Codes
  - Multiple dot styles (square, rounded, circle, gapped, etc.)
  - Custom eye patterns
  - Configurable colors
- 💾 Save and manage QR codes
- ⬇️ Download QR codes as PNG
- 🎯 Real-time preview

## Demonstration Video
[![QrGenerate demonstration video]https://www.youtube.com/watch?v=6x6Bq847SYo)

## Prerequisites

Before you begin, ensure you have the following installed:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/eren9677/ApiLearn.git
cd ApiLearn
```

2. Build and start the containers:
```bash
docker-compose up --build
```

## Accessing the Application

Once the containers are running, you can access:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:8000](http://localhost:8000)

