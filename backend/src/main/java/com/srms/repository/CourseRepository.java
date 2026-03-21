package com.srms.repository;

import com.srms.model.Course;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CourseRepository {

    private final JdbcTemplate jdbc;

    public CourseRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<Course> findAll() {
        return jdbc.query(
                "SELECT c.course_id, c.course_name, c.course_code, c.credits, c.department, c.staff_id, c.created_at, "
                        + "s.first_name, s.last_name "
                        + "FROM courses c "
                        + "LEFT JOIN staff s ON c.staff_id = s.staff_id",
                (rs, rowNum) -> {
                    Course c = new Course();
                    c.setCourseId(rs.getInt("course_id"));
                    c.setCourseName(rs.getString("course_name"));
                    c.setCourseCode(rs.getString("course_code"));
                    c.setCredits(rs.getInt("credits"));
                    c.setDepartment(rs.getString("department"));
                    int staffId = rs.getInt("staff_id");
                    if (!rs.wasNull()) {
                        c.setStaffId(staffId);
                    }
                    String fn = rs.getString("first_name");
                    String ln = rs.getString("last_name");
                    String fullName = ((fn != null ? fn : "") + " " + (ln != null ? ln : "")).trim();
                    c.setInstructorName(fullName.isEmpty() ? null : fullName);
                    c.setCreatedAt(rs.getTimestamp("created_at"));
                    return c;
                }
        );
    }

    public void save(Course course) {
        boolean update = course.getCourseId() > 0;
        if (update) {
            jdbc.update(
                    "UPDATE courses SET course_name=?, course_code=?, credits=?, department=?, staff_id=? WHERE course_id=?",
                    course.getCourseName(),
                    course.getCourseCode(),
                    course.getCredits(),
                    course.getDepartment(),
                    course.getStaffId(),
                    course.getCourseId()
            );
        } else {
            jdbc.update(
                    "INSERT INTO courses (course_name, course_code, credits, department, staff_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
                    course.getCourseName(),
                    course.getCourseCode(),
                    course.getCredits(),
                    course.getDepartment(),
                    course.getStaffId()
            );
        }
    }

    public void delete(int courseId) {
        jdbc.update("DELETE FROM courses WHERE course_id=?", courseId);
    }
}

