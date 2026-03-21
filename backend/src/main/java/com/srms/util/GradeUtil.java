package com.srms.util;

public class GradeUtil {
    public static Double gradeToPoints(String grade) {
        if (grade == null) return null;
        String g = grade.trim().toUpperCase();
        if (g.isEmpty()) return null;
        switch (g) {
            case "A": return 4.0;
            case "A-": return 3.7;
            case "B+": return 3.3;
            case "B": return 3.0;
            case "B-": return 2.7;
            case "C+": return 2.3;
            case "C": return 2.0;
            case "C-": return 1.7;
            case "F": return 0.0;
            default: return null;
        }
    }
}

