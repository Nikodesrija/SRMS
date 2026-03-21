package com.srms.repository;

import com.srms.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbc;

    public UserRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public User findByUsername(String username) {
        List<User> list = jdbc.query(
                "SELECT * FROM users WHERE username=?",
                (rs, rowNum) -> {
                    User u = new User();
                    u.setUserId(rs.getInt("user_id"));
                    u.setUsername(rs.getString("username"));
                    u.setPassword(rs.getString("password"));
                    u.setRole(rs.getString("role"));
                    u.setCreatedAt(rs.getTimestamp("created_at"));
                    return u;
                },
                username
        );
        return list.isEmpty() ? null : list.get(0);
    }

    public List<User> findAll() {
        return jdbc.query(
                "SELECT * FROM users",
                (rs, rowNum) -> {
                    User u = new User();
                    u.setUserId(rs.getInt("user_id"));
                    u.setUsername(rs.getString("username"));
                    u.setPassword(rs.getString("password"));
                    u.setRole(rs.getString("role"));
                    u.setCreatedAt(rs.getTimestamp("created_at"));
                    return u;
                }
        );
    }

    public int saveAndReturnId(User u) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO users (username, password, role, created_at) VALUES (?, ?, ?, NOW())",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, u.getUsername());
            ps.setString(2, u.getPassword());
            ps.setString(3, u.getRole());
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        if (key == null) {
            throw new RuntimeException("Failed to retrieve generated user_id");
        }
        u.setUserId(key.intValue());
        return key.intValue();
    }

    public void update(User u) {
        jdbc.update(
                "UPDATE users SET username=?, role=? WHERE user_id=?",
                u.getUsername(), u.getRole(), u.getUserId()
        );
    }

    public void updatePassword(int userId, String password) {
        jdbc.update("UPDATE users SET password=? WHERE user_id=?", password, userId);
    }

    public void deleteById(int userId) {
        jdbc.update("DELETE FROM users WHERE user_id=?", userId);
    }
}

