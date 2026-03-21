package com.srms.repository;

import com.srms.model.Staff;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class StaffRepository {

    private final JdbcTemplate jdbc;

    public StaffRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<Staff> findAll() {
        return jdbc.query(
                "SELECT * FROM staff",
                (rs, rowNum) -> {
                    Staff s = new Staff();
                    s.setStaffId(rs.getInt("staff_id"));
                    s.setUserId(rs.getInt("user_id"));
                    s.setFirstName(rs.getString("first_name"));
                    s.setLastName(rs.getString("last_name"));
                    s.setEmail(rs.getString("email"));
                    s.setDepartment(rs.getString("department"));
                    return s;
                }
        );
    }

    public Staff findByUserId(int userId) {
        List<Staff> list = jdbc.query(
                "SELECT * FROM staff WHERE user_id=?",
                (rs, rowNum) -> {
                    Staff s = new Staff();
                    s.setStaffId(rs.getInt("staff_id"));
                    s.setUserId(rs.getInt("user_id"));
                    s.setFirstName(rs.getString("first_name"));
                    s.setLastName(rs.getString("last_name"));
                    s.setEmail(rs.getString("email"));
                    s.setDepartment(rs.getString("department"));
                    return s;
                },
                userId
        );
        return list.isEmpty() ? null : list.get(0);
    }
}

