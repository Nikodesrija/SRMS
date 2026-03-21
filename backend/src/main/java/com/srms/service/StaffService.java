package com.srms.service;

import com.srms.model.Staff;
import com.srms.repository.StaffRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StaffService {

    private final StaffRepository repo;

    public StaffService(StaffRepository repo) {
        this.repo = repo;
    }

    public List<Staff> getAllStaff() {
        return repo.findAll();
    }

    public Staff getByUserId(int userId) {
        return repo.findByUserId(userId);
    }
}

