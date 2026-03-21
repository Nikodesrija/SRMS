# 🗄️ SRMS Database Setup Guide (Updated Schema)

This guide explains how to set up the **Student Record Management System (SRMS)** database using the latest normalized schema.

---

## 📌 Prerequisites

* MySQL Server installed and running
* MySQL Workbench / CLI access
* Java Spring Boot backend ready

---

## 🧱 Step 1: Create & Initialize Database

Run the full SQL script (provided in project) which:

* Drops existing DB (if exists)
* Creates fresh database
* Creates all tables with relationships
* Inserts sample data

### ▶️ Using MySQL CLI

```bash
mysql -u root -p
```

```sql
SOURCE path/to/your/script.sql;
```

OR

```bash
mysql -u root -p srms_db < database_setup.sql
```

---

### ▶️ Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your server
3. Open `database_setup.sql`
4. Click **Execute (⚡)**

---

## 🏗️ Database Schema Overview

### 📌 Tables

| Table         | Description                       |
| ------------- | --------------------------------- |
| `users`       | Login credentials & roles         |
| `staff`       | Staff details (linked to users)   |
| `students`    | Student details (linked to users) |
| `courses`     | Courses assigned to staff         |
| `enrollments` | Student-course mapping            |
| `results`     | Grades for each enrollment        |

---

### 🔗 Relationships

* `users → staff` (1:1)
* `users → students` (1:1)
* `staff → courses` (1:N)
* `students → enrollments` (1:N)
* `courses → enrollments` (1:N)
* `enrollments → results` (1:1)

---

## 🌱 Sample Data Inserted

### 👤 Users

* 1 Admin
* 2 Staff
* 5 Students

---

### 👨‍🏫 Staff

* Robert Brown → Computer Science
* Sarah Miller → Mathematics

---

### 👨‍🎓 Students

* 5 students across departments
* Linked with user accounts

---

### 📚 Courses

* CS101 – Data Structures
* CS102 – Database Management
* CS201 – Web Development
* CS301 – Software Engineering
* CS401 – Machine Learning
* MATH101 – Linear Algebra
* MATH102 – Calculus

---

### 📝 Enrollments

* Students mapped to multiple courses
* Semester-based records

---

### 🎯 Results (Grades)

* Stored in separate table (`results`)
* Includes:

  * Grade (A, B+, etc.)
  * Grade Points (4.0 scale)

---

## 🔍 Verify Data

Run these queries:

```sql
SELECT * FROM users;
SELECT * FROM staff;
SELECT * FROM students;
SELECT * FROM courses;
SELECT * FROM enrollments;
SELECT * FROM results;
```

---

### 📊 View Student Transcript

```sql
SELECT
s.first_name,
s.last_name,
c.course_code,
c.course_name,
e.semester,
r.grade
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
JOIN courses c ON e.course_id = c.course_id
LEFT JOIN results r ON e.enrollment_id = r.enrollment_id;
```

---

## 🔐 Test Login Credentials

### 👨‍💼 Admin

* Username: `admin1`
* Password: `pass123`

### 👨‍🏫 Staff

* Username: `staff1`
* Password: `pass123`

### 👨‍🎓 Student

* Username: `student1`
* Password: `pass123`


