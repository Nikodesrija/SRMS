package com.srms.repository;

import com.srms.model.Student;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public class StudentRepository {

    private final JdbcTemplate jdbc;

    public StudentRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<Student> findAll() {
        return jdbc.query(
                "SELECT * FROM students",
                (rs, rowNum) -> {
                    Student s = new Student();
                    s.setStudentId(rs.getInt("student_id"));
                    s.setUserId(rs.getInt("user_id"));
                    s.setFirstName(rs.getString("first_name"));
                    s.setLastName(rs.getString("last_name"));
                    s.setEmail(rs.getString("email"));
                    s.setPhone(rs.getString("phone"));
                    s.setDateOfBirth(rs.getDate("date_of_birth"));
                    s.setDepartment(rs.getString("department"));
                    s.setEnrollmentYear(rs.getInt("enrollment_year"));
                    s.setStatus(rs.getString("status"));
                    s.setCreatedAt(rs.getTimestamp("created_at"));
                    s.setUpdatedAt(rs.getTimestamp("updated_at"));
                    return s;
                }
        );
    }

    public Student findByUserId(int userId) {
        List<Student> list = jdbc.query(
                "SELECT * FROM students WHERE user_id=?",
                (rs, rowNum) -> {
                    Student s = new Student();
                    s.setStudentId(rs.getInt("student_id"));
                    s.setUserId(rs.getInt("user_id"));
                    s.setFirstName(rs.getString("first_name"));
                    s.setLastName(rs.getString("last_name"));
                    s.setEmail(rs.getString("email"));
                    s.setPhone(rs.getString("phone"));
                    s.setDateOfBirth(rs.getDate("date_of_birth"));
                    s.setDepartment(rs.getString("department"));
                    s.setEnrollmentYear(rs.getInt("enrollment_year"));
                    s.setStatus(rs.getString("status"));
                    s.setCreatedAt(rs.getTimestamp("created_at"));
                    s.setUpdatedAt(rs.getTimestamp("updated_at"));
                    return s;
                },
                userId
        );
        return list.isEmpty() ? null : list.get(0);
    }

    public void save(Student s) {
        jdbc.update(
                "INSERT INTO students(user_id,first_name,last_name,email,phone,date_of_birth,department,enrollment_year,status) VALUES(?,?,?,?,?,?,?,?,?)",
                s.getUserId(),
                s.getFirstName(),
                s.getLastName(),
                s.getEmail(),
                s.getPhone(),
                s.getDateOfBirth() != null ? new Date(s.getDateOfBirth().getTime()) : null,
                s.getDepartment(),
                s.getEnrollmentYear(),
                s.getStatus()
        );
    }

    public void update(Student s) {
        jdbc.update(
                "UPDATE students SET first_name=?, last_name=?, email=?, phone=?, department=?, enrollment_year=?, status=? WHERE student_id=?",
                s.getFirstName(),
                s.getLastName(),
                s.getEmail(),
                s.getPhone(),
                s.getDepartment(),
                s.getEnrollmentYear(),
                s.getStatus(),
                s.getStudentId()
        );
    }

    public void deleteByStudentId(int studentId) {
        // delete user cascades to students
        jdbc.update("DELETE FROM users WHERE user_id=(SELECT user_id FROM students WHERE student_id=?)", studentId);
    }
}

