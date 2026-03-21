package com.srms.controller;

import com.srms.model.Enrollment;
import com.srms.service.EnrollmentService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    private final EnrollmentService service;

    public EnrollmentController(EnrollmentService service) {
        this.service = service;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Enrollment> list() {
        return service.getEnrollments();
    }

    @PostMapping(consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> create(
            @RequestParam int studentId,
            @RequestParam int courseId,
            @RequestParam String semester
    ) {
        Enrollment e = new Enrollment();
        e.setStudentId(studentId);
        e.setCourseId(courseId);
        e.setSemester(semester);
        service.saveEnrollment(e);
        return Map.of("success", true, "message", "Enrollment added successfully");
    }

    @PutMapping(consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> update(
            @RequestParam int enrollmentId,
            @RequestParam int studentId,
            @RequestParam int courseId,
            @RequestParam String semester
    ) {
        Enrollment e = new Enrollment();
        e.setEnrollmentId(enrollmentId);
        e.setStudentId(studentId);
        e.setCourseId(courseId);
        e.setSemester(semester);
        service.saveEnrollment(e);
        return Map.of("success", true, "message", "Enrollment updated successfully");
    }

    @DeleteMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> delete(@RequestParam("id") int id) {
        service.deleteEnrollment(id);
        return Map.of("success", true, "message", "Enrollment deleted successfully");
    }
}

