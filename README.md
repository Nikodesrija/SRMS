# 🎓 Student Record Management System (SRMS)

A **full-stack role-based web application** for managing students, courses, enrollments, and academic results using **Spring Boot + MySQL + HTML/CSS/JS**.

This system provides dedicated dashboards for:

* 👨‍💼 Admin
* 👨‍🏫 Staff
* 👨‍🎓 Student

---

## ✨ Features

### 🔐 1. Role-Based Authentication

* Secure login using JWT
* Role-based access control (Admin / Staff / Student)
* Separate dashboards for each role

---

### 👨‍💼 2. Admin Dashboard

* Manage Users (Admin, Staff, Students)
* Add / Update / Delete Students
* Add / Update / Delete Courses
* View system analytics (charts)
* Generate reports

---

### 👨‍🏫 3. Staff Dashboard

* Manage Students
* Manage Courses
* Handle Enrollments
* Assign & update grades

---

### 👨‍🎓 4. Student Dashboard

* View enrolled courses
* View grades and GPA
* Track academic progress
* View current & completed courses

---

### 📊 5. Analytics & Reports

* Students per department (Chart.js)
* Role distribution
* Export reports (CSV)

---

## 🗄️ Database Design

Relational schema with proper mappings:

* **users** → authentication
* **students** → linked to users
* **staff** → linked to users
* **courses** → managed by staff
* **enrollments** → student-course mapping
* **results** → grades per enrollment

---

## 🌱 Seed Data

### Sample Users

| Username | Password | Role |
|----------|----------|------|
| admin1 | pass123 | Admin |
| staff1 | pass123 | Staff |
| student1 | pass123 | Student |

---

### Sample Courses

| Course Code | Course Name |
|------------|-------------|
| CS101 | Data Structures |
| CS102 | Database Management |
| CS201 | Web Development |
| MATH101 | Linear Algebra |

---

### Sample Enrollments

* Students mapped to multiple courses
* Includes semesters and grades

---

## 🛠️ Tech Stack

### Backend
* Java
* Spring Boot
* Spring Data JPA
* REST APIs
* JWT Authentication

### Frontend
* HTML
* CSS
* Bootstrap
* JavaScript
* Chart.js

### Database
* MySQL

---

## 📁 Project Structure

```id="x92k3a"
SRMS-SB/
│
├── backend/
│   ├── controller/        # REST APIs
│   ├── service/           # Business logic
│   ├── repository/        # DB access layer
│   ├── model/             # Entity classes
│   ├── security/          # JWT config
│   ├── config/            # App configs
│   └── SrmsApplication.java
│
├── frontend/
│   ├── css/
│   ├── js/
│   └── *.html             # UI pages
│
├── pom.xml
└── DATABASE_SETUP.md
```

---

## ⚙️ How to Run the Project

### 1️⃣ Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Runs on:
👉 http://localhost:8080

---

### 2️⃣ Database Setup

* Create MySQL database: `srms_db`
* Run SQL scripts from `DATABASE_SETUP.md`

---

### 3️⃣ Frontend Setup

* Open `frontend/login.html` in browser
* OR use Live Server

---

## 🌐 Application URLs

* Login Page → `login.html`
* Admin Dashboard → `admin-dashboard.html`
* Staff Dashboard → `staff-dashboard.html`
* Student Dashboard → `student-dashboard.html`

---

## 📸 Screenshots
🔹 Home Page
![Homepage](https://github.com/user-attachments/assets/12f588a8-6391-4fbd-9877-1a6ce69a441e)
🔹 Admin Dashboard
<img width="1600" src="https://github.com/user-attachments/assets/c080bd4d-ca19-4701-bce7-66abd0276996"/>
🔹 Admin Operations on Student
➕ Add Student
<table> <tr> <td> <img width="800" src="https://github.com/user-attachments/assets/63ad046e-b2fc-416a-ba69-6b1c29f6f63b"/> </td> <td> <img width="800" src="https://github.com/user-attachments/assets/637df4bc-9e79-4a08-81fa-05668698ae73"/> </td> </tr> </table>
✏️ Update Student
<table> <tr> <td> <img width="800" src="https://github.com/user-attachments/assets/07dcccf9-d7dd-415a-873e-895f113fa96e"/> </td> <td> <img width="800" src="https://github.com/user-attachments/assets/c1936a19-64e4-4a82-9006-d88679cba8b5"/> </td> </tr> </table>
❌ Delete Student
<table> <tr> <td> <img width="800" src="https://github.com/user-attachments/assets/d42bbc86-642a-462a-be65-fd169c7b0bf5"/> </td> <td> <img width="800" src="https://github.com/user-attachments/assets/a228d3e8-da81-410f-8bcb-c2ca6e8609b8"/> </td> </tr> </table>
🔍 Search Student
<img width="1600" src="https://github.com/user-attachments/assets/45f67524-e3ac-486a-9a52-f5526264526b"/>
🔹 Staff Dashboard
<img width="1600" alt="staffDashboard" src="https://github.com/user-attachments/assets/16e90c25-4e2a-42dc-925b-c58eae4df729" />
🔹 Student Dashboard
 <img width="1600" alt="image" src="https://github.com/user-attachments/assets/9f3cef6a-3235-44b9-b91f-d91bc3875e86" />
---

## 📌 Future Enhancements

* Pagination & search filters
* Email notifications
* Advanced analytics dashboard
* Role-based permissions (fine-grained)
