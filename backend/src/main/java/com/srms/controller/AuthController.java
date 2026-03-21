package com.srms.controller;

import com.srms.model.User;
import com.srms.security.JWTUtil;
import com.srms.service.AuthService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping(consumes = MediaType.ALL_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> login(@RequestBody(required = false) String body) {
        if (body == null) body = "";
        String[] parts = body.split(",", 2);
        if (parts.length < 2) {
            return Map.of("success", false, "message", "Invalid login format");
        }
        String username = parts[0];
        String password = parts[1];
        User u = service.login(username, password);
        if (u == null) {
            return Map.of("success", false, "message", "Invalid credentials");
        }
        String token = JWTUtil.generateToken(u.getUsername());
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("token", token);
        res.put("username", u.getUsername());
        res.put("role", u.getRole());
        return res;
    }
}

