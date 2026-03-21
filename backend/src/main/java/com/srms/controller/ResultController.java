package com.srms.controller;

import com.srms.service.ResultService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/results")
public class ResultController {

    private final ResultService service;

    public ResultController(ResultService service) {
        this.service = service;
    }

    @PostMapping(consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> upsert(@RequestParam int enrollmentId, @RequestParam(required = false) String grade) {
        service.saveOrUpdate(enrollmentId, grade);
        return Map.of("success", true, "message", "Result saved");
    }
}

