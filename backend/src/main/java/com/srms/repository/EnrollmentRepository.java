package com.srms.repository;

import com.srms.model.Enrollment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class EnrollmentRepository {

    private final JdbcTemplate jdbc;

    public EnrollmentRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<Enrollment> findAll() {
        return jdbc.query(
                "SELECT e.enrollment_id, e.student_id, e.course_id, e.semester, e.created_at, r.grade "
                        + "FROM enrollments e "
                        + "LEFT JOIN results r ON e.enrollment_id = r.enrollment_id",
                (rs, rowNum) -> {
                    Enrollment e = new Enrollment();
                    e.setEnrollmentId(rs.getInt("enrollment_id"));
                    e.setStudentId(rs.getInt("student_id"));
                    e.setCourseId(rs.getInt("course_id"));
                    e.setSemester(rs.getString("semester"));
                    e.setGrade(rs.getString("grade"));
                    e.setCreatedAt(rs.getTimestamp("created_at"));
                    return e;
                }
        );
    }

    public void save(Enrollment e) {
        boolean update = e.getEnrollmentId() > 0;
        if (update) {
            jdbc.update(
                    "UPDATE enrollments SET student_id=?, course_id=?, semester=? WHERE enrollment_id=?",
                    e.getStudentId(), e.getCourseId(), e.getSemester(), e.getEnrollmentId()
            );
        } else {
            jdbc.update(
                    "INSERT INTO enrollments (student_id, course_id, semester, created_at) VALUES (?, ?, ?, NOW())",
                    e.getStudentId(), e.getCourseId(), e.getSemester()
            );
        }
    }

    public void delete(int enrollmentId) {
        jdbc.update("DELETE FROM enrollments WHERE enrollment_id=?", enrollmentId);
    }
}

