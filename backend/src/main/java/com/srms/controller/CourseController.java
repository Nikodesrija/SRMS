package com.srms.controller;

import com.srms.model.Course;
import com.srms.service.CourseService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/courses")
public class CourseController {

    private final CourseService service;

    public CourseController(CourseService service) {
        this.service = service;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Course> list() {
        return service.getCourses();
    }

    @PostMapping(consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> create(
            @RequestParam String courseName,
            @RequestParam String courseCode,
            @RequestParam(required = false, defaultValue = "0") int credits,
            @RequestParam(required = false) String department
    ) {
        Course c = new Course();
        c.setCourseName(courseName);
        c.setCourseCode(courseCode);
        c.setCredits(credits);
        c.setDepartment(department);
        service.saveCourse(c);
        return Map.of("success", true, "message", "Course added successfully");
    }

    @PutMapping(consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> update(
            @RequestParam int courseId,
            @RequestParam String courseName,
            @RequestParam String courseCode,
            @RequestParam(required = false, defaultValue = "0") int credits,
            @RequestParam(required = false) String department
    ) {
        Course c = new Course();
        c.setCourseId(courseId);
        c.setCourseName(courseName);
        c.setCourseCode(courseCode);
        c.setCredits(credits);
        c.setDepartment(department);
        service.saveCourse(c);
        return Map.of("success", true, "message", "Course updated successfully");
    }

    @DeleteMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> delete(@RequestParam("id") int id) {
        service.deleteCourse(id);
        return Map.of("success", true, "message", "Course deleted successfully");
    }
}

