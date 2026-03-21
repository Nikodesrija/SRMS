package com.srms.controller;

import com.srms.model.Student;
import com.srms.service.StudentService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Object listOrProfile(@RequestParam(value = "username", required = false) String username) {
        if (username != null && !username.isEmpty()) {
            Student s = service.getByUsername(username);
            if (s == null) {
                return Map.of("success", false, "message", "Student profile not found");
            }
            return Map.of("success", true, "data", s);
        }
        List<Student> list = service.getStudents();
        return list;
    }

    @PostMapping(consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> create(
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String email,
            @RequestParam(required = false) String phone,
            @RequestParam String department,
            @RequestParam(required = false, defaultValue = "0") int enrollmentYear,
            @RequestParam(required = false, defaultValue = "Active") String status
    ) {
        Student s = new Student();
        s.setFirstName(firstName);
        s.setLastName(lastName);
        s.setEmail(email);
        s.setPhone(phone);
        s.setDepartment(department);
        s.setEnrollmentYear(enrollmentYear);
        s.setStatus(status);
        service.addStudent(s);
        return Map.of("success", true, "message", "Student added successfully");
    }

    @PutMapping(consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> update(
            @RequestParam int studentId,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String email,
            @RequestParam(required = false) String phone,
            @RequestParam String department,
            @RequestParam(required = false, defaultValue = "0") int enrollmentYear,
            @RequestParam(required = false, defaultValue = "Active") String status
    ) {
        Student s = new Student();
        s.setStudentId(studentId);
        s.setFirstName(firstName);
        s.setLastName(lastName);
        s.setEmail(email);
        s.setPhone(phone);
        s.setDepartment(department);
        s.setEnrollmentYear(enrollmentYear);
        s.setStatus(status);
        service.updateStudent(s);
        return Map.of("success", true, "message", "Student updated successfully");
    }

    @DeleteMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> delete(@RequestParam("id") int id) {
        service.deleteStudent(id);
        return Map.of("success", true, "message", "Student deleted successfully");
    }
}

