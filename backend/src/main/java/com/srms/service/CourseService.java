package com.srms.service;

import com.srms.model.Course;
import com.srms.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository repo;

    public CourseService(CourseRepository repo) {
        this.repo = repo;
    }

    public List<Course> getCourses() {
        return repo.findAll();
    }

    public void saveCourse(Course c) {
        repo.save(c);
    }

    public void deleteCourse(int id) {
        repo.delete(id);
    }
}

