# RoomsForUse - Hotel Management Application

A complete, modern, full-stack **Hotel Management Application** built with React, Vite, Node.js, Express, MongoDB, and Bootstrap.

---

## 📁 Project Structure

```
Hotel-Management-Application/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RoomCard.jsx
│   │   │   ├── BookingCard.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── AdminTabs.jsx
│   │   │   └── AuthIllustration.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Rooms.jsx
│   │   │   ├── RoomDetails.jsx
│   │   │   ├── Booking.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageRooms.jsx
│   │   │   ├── ManageBookings.jsx
│   │   │   ├── ManageUsers.jsx
│   │   │   └── NotFound.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── getToken.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── roomController.js
│   │   ├── bookingController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Room.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── roomRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── dashboardRoutes.js
│   ├── uploads/
│   ├── .env
│   ├── .env.example
│   ├── index.js
│   ├── seed.js
│   └── package.json
└── README.md
```

---

## 🚀 Step-by-Step Execution Guide

### 1. Database Setup
Make sure MongoDB is running locally on:
`mongodb://localhost:27017/hotel`

Seed the database with sample rooms, default users, and sample bookings:
```bash
cd server
node seed.js
```

### 2. Start Backend Server
```bash
cd server
npm run dev
# Server will run at http://localhost:8001
```

### 3. Start Frontend Client
```bash
cd client
npm run dev
# Frontend will run at http://localhost:5173
```

---

## 🔑 Default Login Credentials

### Admin Account
- **Email:** `admin@hotel.com`
- **Password:** `admin123`
- **Access:** Admin Dashboard, Manage Rooms, Manage Bookings, Manage Users, Add/Edit/Delete Rooms.

### User Account
- **Email:** `sun@gmail.com`
- **Password:** `user123`
- **Access:** Browse rooms, Filter, Book rooms, View My Bookings, Cancel reservation.

---

## ✨ Features
1. **Pixel-Perfect UI:** Follows the reference design for Register, Login, Room cards, Bookings list, and Admin table view.
2. **Complete Role-Based Authentication:** Protected JWT routes for user & admin.
3. **Room Management:** Add, edit, delete, and upload room images via Multer.
4. **Booking Reservation System:** Overlapping date conflict check, automatic night & price calculation.
5. **Real-Time Admin Dashboard:** Statistics cards, revenue trends, occupancy rate, user directory.