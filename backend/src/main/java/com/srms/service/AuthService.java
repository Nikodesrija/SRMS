package com.srms.service;

import com.srms.model.User;
import com.srms.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository repo;

    public AuthService(UserRepository repo) {
        this.repo = repo;
    }

    public User login(String username, String password) {
        User u = repo.findByUsername(username);
        if (u != null && u.getPassword() != null && u.getPassword().equals(password)) {
            return u;
        }
        return null;
    }
}

