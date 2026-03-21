package com.srms.service;

import com.srms.model.User;
import com.srms.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<User> getUsers() {
        return repository.findAll();
    }

    public void addUser(User user) {
        repository.saveAndReturnId(user);
    }

    public void updateUser(User user) {
        repository.update(user);
    }

    public void deleteUser(int userId) {
        repository.deleteById(userId);
    }

    public void resetPassword(int userId, String newPassword) {
        repository.updatePassword(userId, newPassword);
    }
}

