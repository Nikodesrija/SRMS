package com.srms.service;

import com.srms.repository.ResultRepository;
import com.srms.util.GradeUtil;
import org.springframework.stereotype.Service;

@Service
public class ResultService {

    private final ResultRepository repo;

    public ResultService(ResultRepository repo) {
        this.repo = repo;
    }

    public void saveOrUpdate(int enrollmentId, String grade) {
        Double points = GradeUtil.gradeToPoints(grade);
        repo.upsert(enrollmentId, grade, points);
    }
}

