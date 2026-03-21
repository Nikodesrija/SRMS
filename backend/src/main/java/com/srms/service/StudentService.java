package com.srms.service;

import com.srms.model.Student;
import com.srms.model.User;
import com.srms.repository.StudentRepository;
import com.srms.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository repo;
    private final UserRepository userRepo;

    public StudentService(StudentRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    public void addStudent(Student s) {
        User u = new User();
        u.setUsername(s.getEmail() != null && !s.getEmail().isEmpty()
                ? s.getEmail()
                : (s.getFirstName() + "." + s.getLastName()).toLowerCase());
        u.setPassword("pass123");
        u.setRole("student");

        int userId = userRepo.saveAndReturnId(u);
        s.setUserId(userId);
        if (s.getStatus() == null || s.getStatus().isEmpty()) {
            s.setStatus("Active");
        }
        repo.save(s);
    }

    public List<Student> getStudents() {
        return repo.findAll();
    }

    public void updateStudent(Student s) {
        repo.update(s);
    }

    public void deleteStudent(int studentId) {
        repo.deleteByStudentId(studentId);
    }

    public Student getByUsername(String username) {
        User u = userRepo.findByUsername(username);
        if (u == null) return null;
        return repo.findByUserId(u.getUserId());
    }
}

