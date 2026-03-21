package com.srms.controller;

import com.srms.model.User;
import com.srms.service.UserService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<User> list() {
        return service.getUsers();
    }

    @PostMapping(consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> create(
            @RequestParam String username,
            @RequestParam(required = false) String password,
            @RequestParam String role
    ) {
        User u = new User();
        u.setUsername(username);
        u.setPassword(password != null && !password.isEmpty() ? password : "pass123");
        u.setRole(role);
        service.addUser(u);
        return Map.of("success", true, "message", "User added successfully");
    }

    @PutMapping(consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> update(
            @RequestParam int userId,
            @RequestParam String username,
            @RequestParam String role,
            @RequestParam(required = false) String password
    ) {
        if (password != null && !password.isEmpty()) {
            service.resetPassword(userId, password);
        }
        User u = new User();
        u.setUserId(userId);
        u.setUsername(username);
        u.setRole(role);
        service.updateUser(u);
        return Map.of("success", true, "message", "User updated successfully");
    }

    @DeleteMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> delete(@RequestParam("id") int id) {
        service.deleteUser(id);
        return Map.of("success", true, "message", "User deleted successfully");
    }
}

