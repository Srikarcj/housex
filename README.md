# HouseX - Professional Home Services Platform

HouseX is a modern platform connecting clients with professional painters and housebuilders. The platform enables users to find, book, and manage home improvement services efficiently.

## Features

- 🔐 Secure authentication with Clerk
- 👥 Role-based access (Client, Painter, HouseBuilder, Admin)
- 🏠 Professional profiles with portfolios
- 📅 Booking system with real-time availability
- ⭐ Rating and review system
- 💬 Real-time messaging
- 📊 Admin dashboard with analytics

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Authentication**: Clerk
- **File Storage**: Cloudinary
- **Real-time**: Socket.io

## Project Structure

```
/housex
├── /frontend          # React frontend application
├── /backend           # Node.js + Express backend
├── .env              # Environment variables
└── README.md         # Project documentation
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Clerk Account
- Cloudinary Account

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   CLERK_SECRET_KEY=your_clerk_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 