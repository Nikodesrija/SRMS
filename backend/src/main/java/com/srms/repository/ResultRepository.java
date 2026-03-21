package com.srms.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ResultRepository {

    private final JdbcTemplate jdbc;

    public ResultRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void upsert(int enrollmentId, String grade, Double gradePoints) {
        jdbc.update(
                "INSERT INTO results (enrollment_id, grade, grade_points, created_at) VALUES (?,?,?,NOW()) "
                        + "ON DUPLICATE KEY UPDATE grade=VALUES(grade), grade_points=VALUES(grade_points)",
                enrollmentId,
                grade,
                gradePoints
        );
    }
}

