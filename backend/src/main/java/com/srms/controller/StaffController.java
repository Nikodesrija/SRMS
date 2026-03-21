package com.srms.controller;

import org.springframework.web.bind.annotation.*;

import com.srms.model.Staff;
import com.srms.model.User;
import com.srms.repository.StaffRepository;
import com.srms.repository.UserRepository;

@RestController
@RequestMapping("/staff")
@CrossOrigin
public class StaffController {

    private final StaffRepository staffRepo;
    private final UserRepository userRepo;

    public StaffController(StaffRepository staffRepo, UserRepository userRepo) {
        this.staffRepo = staffRepo;
        this.userRepo = userRepo;
    }

    @GetMapping
    public Staff getStaffByUsername(@RequestParam String username) {

        User user = userRepo.findByUsername(username);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Staff staff = staffRepo.findByUserId(user.getUserId());

        if (staff == null) {
            throw new RuntimeException("Staff not found");
        }

        return staff;
    }
}
