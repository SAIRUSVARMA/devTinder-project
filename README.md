# DevTinder
Namaste React Course

## 🚀 Overview

**devTinder** is a MERN stack application where developers can create profiles, send connection requests, and connect with each other, similar to a networking platform. This repository contains the frontend and backend for devTinder.

## 🛠 Tech Stack

-  **Frontend:** React.js, Vite, Redux Toolkit, Tailwind CSS
-  **State Management:** Redux Toolkit
-  **Backend:** [devTinder Backend](https://github.com/akshadjaiswal/devTinder-backend)
-  **Authentication:** JWT
-  **Database:** MongoDB (via backend)

## 🏗️ Installation & Setup

1. Clone the repository:
```sh
git clone https://github.com/your-username/devTinder-frontend.git
```

2. Navigate to the project directory:
```sh
cd devTinder-frontend
```

3. Install dependencies:
```sh
npm install
```

4. Start the development server:
```sh
npm run dev
```

## 📌 Features

- 🏠 **Developer Profiles** - Create and customize your profile.
- 🤝 **Connect with Developers** - Send and accept connection requests.
- 🔒 **Authentication** - Secure login & signup using JWT.
- 👀 **View Profiles** - Browse other developer profiles.
- ✏️ **Edit Profile** - Update personal details, skills, and bio.
- 📩 **Send Connection Requests** - Request to connect with other developers.
- ✅ **Review Connection Requests** - Accept or reject incoming connection requests.
- 🌍 **Responsive Design** - Fully optimized for mobile & desktop.

> ⚠️ **Note:** The backend is **fully functional** and ready for further scaling and optimizations.

---



## 🛠️ Tech Stack
- **Backend Framework**: [Node.js](https://nodejs.org/en) + [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- **Authentication**: [JWT (JSON Web Tokens)](https://jwt.io/) + Cookies
- **Encryption**: [bcryptjs](https://www.npmjs.com/package/bcryptjs) for password hashing
- **API Testing**: Postman
- **Environment Variables Management**: dotenv
- **Package Manager**: npm

---

## 🔑 Features Implemented

### **1. Authentication System**
✅ User Signup, Login, and Logout  
✅ JWT-based authentication with secure cookies  
✅ Password encryption using **bcryptjs**  
✅ Authentication middleware to protect routes  

### **2. User Profile Management**
✅ View user profile  
✅ Edit profile details (restricted fields for security)  
✅ Update password with validation  

### **3. Connection Request System**
✅ Send connection requests (`Interested` or `Ignored`)  
✅ Accept or reject received requests  
✅ Prevent duplicate requests using MongoDB validation  
✅ Prevent self-requests using Mongoose `.pre` middleware  

### **4. Feed API & Pagination**
✅ Fetch suggested developers while excluding:  
   - Logged-in user  
   - Existing connections  
   - Ignored users  
   - Users with pending requests  
✅ Implemented **pagination** using `skip` & `limit`  
✅ Optimized query using **MongoDB $nin and $ne operators**  

### **5. Database Design**
✅ **User Schema**:
   - Sanitized input fields (`trim`, `lowercase`, validation)
   - Unique constraints on email and username  

✅ **ConnectionRequest Schema**:
   - `fromUserId`, `toUserId`, `status` with **enum validation**
   - Indexed fields for optimized queries  
   - Prevents multiple requests between the same users  

### **6. Advanced Query Optimization**
✅ **Indexes & Compound Indexes**:
   - Used `index: true` for faster queries  
   - Implemented compound indexes to optimize search  

### **7. Middleware Implementation**
✅ **Authentication Middleware**: Protects private routes  
✅ **Error Handling Middleware**: Centralized error response  
✅ **Mongoose `.pre` Middleware**: Prevents self-requests  

### **8. Express Router Structure**
✅ Modular route organization for maintainability  
✅ APIs structured into separate routers (`auth`, `profile`, `connections`, `users`)  

---

## 🚀 API Endpoints

### **1️⃣ Authentication Routes**
| Method | Endpoint      | Description          | Auth Required |
|--------|--------------|----------------------|--------------|
| POST   | `/auth/signup` | Register a new user | ❌ |
| POST   | `/auth/login` | Authenticate user & issue JWT | ❌ |
| POST   | `/auth/logout` | Logout user by clearing JWT cookie | ✅ |

---

### **2️⃣ User Profile Routes**
| Method | Endpoint           | Description              | Auth Required |
|--------|-------------------|------------------------|--------------|
| GET    | `/profile/view`   | Get logged-in user profile | ✅ |
| PATCH  | `/profile/edit`   | Update allowed profile fields | ✅ |
| PATCH  | `/profile/password` | Update user password | ✅ |

---

### **3️⃣ Connection Request Routes**
| Method | Endpoint                                    | Description                 | Auth Required |
|--------|--------------------------------------------|-----------------------------|--------------|
| POST   | `/request/send/:status/:toUserId`         | Send a connection request (Interested/Ignored) | ✅ |
| POST   | `/request/review/:status/:requestId`      | Accept/Reject a request | ✅ |
| GET    | `/user/requests/received`                 | Fetch pending connection requests | ✅ |
| GET    | `/user/connections`                       | Fetch accepted connections | ✅ |

---

### **4️⃣ Feed API & Pagination**
| Method | Endpoint      | Description                              | Auth Required |
|--------|--------------|----------------------------------------|--------------|
| GET    | `/user/feed?page=1&limit=10` | Get suggested developer profiles with pagination | ✅ |

---

## 🏗️ Setup & Running the Server

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/akshadjaiswal/devTinder-backend.git
cd devTinder-backend
```

### **2️⃣ Set Up Environment Variables**
Create a `.env` file and add:
```ini
DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/devTinder
JWT_SECRET=your_jwt_secret
PORT=5000
```

### **3️⃣ Start the Backend Server**
```bash
npm start
```
Server runs at: `http://localhost:5000/`

---





## Team
NIT © [Sairus Varma ](https://github.com/SAIRUSVARMA)
