# FoodHub - Full Stack Food Delivery App

This is a production-ready MERN stack application for food delivery, featuring multiple roles (User, Admin, Restaurant Owner, Delivery Boy).

## 🚀 Production Deployment Guide

### 1. Environment Variables

Create a `.env` file in both `backend` and `frontend` directories based on the `.env.example` files provided.

#### Backend Required Variables:
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `FRONTEND_URL`: URL of the deployed frontend
- `PORT`: Port to run the server (default: 5000)
- `GOOGLE_CLIENT_ID`: For Google Auth
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`: For payments
- `STRIPE_SECRET_KEY`: For Stripe payments
- `CLOUDINARY_CLOUD_NAME` / `API_KEY` / `API_SECRET`: For image uploads

### 2. Backend Security & Performance

The backend is pre-configured with:
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Protects against brute force (100 req / 15 min)
- **Compression**: Gzip/Brotli response compression
- **Morgan**: Production logging
- **Environment Validation**: Fails fast if required variables are missing

### 3. Build & Deployment

#### Frontend
```bash
cd frontend
npm install
npm run build
```
The production assets will be in `frontend/dist`. These can be served via Nginx, Vercel, Netlify, or AWS S3.

#### Backend
```bash
cd backend
npm install
npm start
```
Deploy the backend to Heroku, Render, Railway, or a VPS (using PM2).

### 4. Database Optimization
Models are indexed for high performance:
- `User`: GeoJSON 2dsphere index for location
- `Restaurant`: Text index for search and 2dsphere for location
- `Order`: Compound indexes for user/restaurant lookups

## 🐳 Running with Docker

The easiest way to run the entire stack is using Docker Compose.

### Prerequisites
- Docker and Docker Compose installed.

### Steps
1. Create `.env` files in `backend/` and `frontend/` as described above.
2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```
3. Access the app:
   - Frontend: `http://localhost`
   - Backend API: `http://localhost:5000/api`

### Managing Containers
- Stop: `docker-compose down`
- Status: `docker-compose ps`
- Logs: `docker-compose logs -f`
