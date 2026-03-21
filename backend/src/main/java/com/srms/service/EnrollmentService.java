package com.srms.service;

import com.srms.model.Enrollment;
import com.srms.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository repo;

    public EnrollmentService(EnrollmentRepository repo) {
        this.repo = repo;
    }

    public List<Enrollment> getEnrollments() {
        return repo.findAll();
    }

    public void saveEnrollment(Enrollment e) {
        repo.save(e);
    }

    public void deleteEnrollment(int id) {
        repo.delete(id);
    }
}

