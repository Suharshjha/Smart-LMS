# Library Management System (LMS)
A full-stack Library Management System

# 🛠️ Tech Stack

🔹 Backend
- Java Spring Boot
- JWT Authentication
- Role-based access (Admin, Librarian, User)
- MySQL Database
- REST APIs

🔹 Frontend
- React.js 
- TailwindCSS 
- Fully responsive UI

# 🚀 Features

🔹 👤 User Features

- Login with JWT
- Search books by title / author / category
- Request a book
- View issued books
- View request status

🔹 📚 Librarian Features

- Add books
- View pending issue requests
- Approve / Reject requests
- Process returns with fine calculation
- View all issued books

🔹 🛠 Admin Features

- Add librarian
- Add users
- Manage user accounts

# 📦 Project Setup

🖥️ Backend Setup (Spring Boot)

1️⃣ Clone the project
```bash
git clone <your-repo-url>
cd backend
```

2️⃣ Configure MySQL

Create a database:
```bash
CREATE DATABASE lms;
```

Update application.properties:
```bash
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

3️⃣ Run the backend

Using Maven:
```bash
mvn spring-boot:run
```

# 🌐 Frontend Setup (React + Tailwind v3)

1️⃣ Move to frontend folder
```bash
cd frontend
```

2️⃣ Install dependencies
```bash
npm install
```
3️⃣ Start frontend
```bash
npm run dev
```

🔑 Default Login Credentials (Sample)
Role	Username	Password
```bash
Admin	admin	admin123
Librarian	librarian	librarian123
User	john	john123
```

(Change these in the database as needed)

🛠 API Endpoints Summary
Auth
```bash
POST /auth/login
```
Admin
```bash
POST /admin/add-user
POST /admin/add-librarian
```
Librarian
```bash
POST /librarian/add-book
GET  /librarian/pending-requests
POST /librarian/approve/{id}
POST /librarian/reject/{id}
POST /librarian/return/{id}
```
User
```bash
GET  /user/search?keyword=java
POST /user/request-book
GET  /user/issued/{userId}
```
# 📁 Folder Structure (Frontend)
```bash
src/
 ├── components/
 ├── pages/
 ├── contexts/
 ├── hooks/
 ├── lib/
 ├── App.tsx
 ├── main.tsx
 └── index.css
```

# 🗄 Database Schema

Tables used:
```bash
users
books
issued_books
```
