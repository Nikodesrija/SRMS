// Student Dashboard Functions
 
let studentCourses = [];
let studentEnrollments = [];
let currentStudent = null;
let currentStudentId = null;

function getCurrentStudentId(){
    return currentStudentId;
}

function loadStudentProfile() {
    const username = localStorage.getItem("username");
    if (!username) {
        checkAuth();
        return Promise.resolve();
    }

    return apiGet("/students?username=" + encodeURIComponent(username))
        .then(res => {
            const data = res.data || res;
            currentStudent = data;
            currentStudentId = data ? data.studentId : null;
        })
        .catch(err => {
            console.error("Failed to load student profile", err);
        });
}
function loadStudents(){
    apiGet("/students").then(data=>{
        let table=document.getElementById("studentsTable")
        if(!table) return;
        const list = Array.isArray(data) ? data : [];
        if (list.length === 0) {
            table.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No students found.</td></tr>';
            return;
        }
        table.innerHTML=""
        list.forEach(s=>{
            let row=`<tr>
            <td>${s.studentId}</td>
            <td>${s.firstName}</td>
            <td>${s.lastName}</td>
            <td>${s.department}</td>
            </tr>`
            table.innerHTML+=row
        })
    }).catch(err => console.error(err))
}

function loadCourses() {
    const studentId = getCurrentStudentId();

Promise.all([
    apiGet("/courses"),
    apiGet("/enrollments")
]).then(([courses,enrollments])=>{

    const myEnrollments = enrollments.filter(e =>
        Number(e.studentId) === Number(studentId)
    )

    const courseIds = myEnrollments.map(e=>e.courseId)

    const list = courses.filter(c =>
        courseIds.includes(c.courseId)
    )

    studentCourses = list

        let table=document.getElementById("coursesList")
        if(!table) return;
        
        if (list.length === 0) {
            table.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No courses found.</td></tr>';
            return;
        }

        table.innerHTML=""
        list.forEach(c=>{
            const instructor = c.instructorName || 'Faculty';
            let row=`<tr>
            <td>${c.courseCode || ''}</td>
            <td>${c.courseName || ''}</td>
            <td>${instructor}</td>
            <td><span class="badge badge-success">Active</span></td>
            <td><button class="btn btn-sm btn-info" onclick="viewCourseDetails(${c.courseId})">View Details</button></td>
            </tr>`
            table.innerHTML+=row
        })
    }).catch(err => {
        console.error(err);
        const table=document.getElementById("coursesList");
        if (table) {
            table.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Failed to load courses.</td></tr>';
        }
    })
}

function viewCourseDetails(courseId) {
    const course = studentCourses.find(c => c.courseId === courseId);
    if (!course) {
        alert('Course details not found');
        return;
    }

    const modalTitle = document.getElementById('courseDetailsModalLabel');
    const modalBody = document.getElementById('courseDetailsModalBody');

    if (modalTitle) modalTitle.textContent = `${course.courseCode || ''} - ${course.courseName || ''}`;
    if (modalBody) {
        modalBody.innerHTML = `
            <p><strong>Course Code:</strong> ${course.courseCode || 'N/A'}</p>
            <p><strong>Course Name:</strong> ${course.courseName || 'N/A'}</p>
            <p><strong>Credits:</strong> ${course.credits || 'N/A'}</p>
            <p><strong>Department:</strong> ${course.department || 'N/A'}</p>
            <p><strong>Description:</strong> This course is part of the curriculum and provides foundational concepts.</p>
        `;
    }

    // Show modal (Bootstrap 4)
    $('#courseDetailsModal').modal('show');
}

function loadEnrollments() {
    const studentId = getCurrentStudentId();

    apiGet("/enrollments").then(data=>{

        const enrollments = Array.isArray(data)
            ? data.filter(e => Number(e.studentId) === Number(studentId))
            : [];

        studentEnrollments = enrollments;
        const courseMap = studentCourses.reduce((acc,c)=>{acc[c.courseId]=c;return acc;}, {});

        let table=document.getElementById("enrollmentsList")
        if(!table) return;
        
        if (enrollments.length === 0) {
            table.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No enrollments found.</td></tr>';
            return;
        }

        table.innerHTML=""
        enrollments.forEach(e=>{
            const course = courseMap[e.courseId];
            const courseLabel = course ? `${course.courseCode || ''} - ${course.courseName || ''}` : `Course ${e.courseId}`;
            let row=`<tr>
            <td>${e.enrollmentId}</td>
            <td>${courseLabel}</td>
            <td>${e.semester || 'N/A'}</td>
            <td>${e.grade || 'Pending'}</td>
            <td><span class="badge badge-info">Active</span></td>
            </tr>`
            table.innerHTML+=row
        })

        updateStudentDashboardStats();
    }).catch(err => {
        console.error(err)
        const table=document.getElementById("enrollmentsList");
        if(table) table.innerHTML='<tr><td colspan="5" class="text-center text-danger">Failed to load enrollments.</td></tr>';
    })
}

function loadGrades() {
   const studentId = getCurrentStudentId();

   apiGet("/enrollments").then(data=>{

        const enrollments = Array.isArray(data)
            ? data.filter(e => Number(e.studentId) === Number(studentId))
            : [];

        studentEnrollments = enrollments;
        const courseMap = studentCourses.reduce((acc,c)=>{acc[c.courseId]=c;return acc;}, {});

        let table=document.getElementById("gradesList")
        if(!table) return;
        
        if (enrollments.length === 0) {
            table.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No grades available.</td></tr>';
            return;
        }

        table.innerHTML=""
        enrollments.forEach(e=>{
            const course = courseMap[e.courseId];
            const courseLabel = course ? `${course.courseCode || ''} - ${course.courseName || ''}` : `Course ${e.courseId}`;
            let row=`<tr>
            <td>${courseLabel}</td>
            <td>${e.semester || 'N/A'}</td>
            <td>${e.grade || 'N/A'}</td>
            <td>${convertGradeToPoints(e.grade)}</td>
            </tr>`
            table.innerHTML+=row
        })

        updateStudentDashboardStats();
    }).catch(err => {
        console.error(err)
        const table=document.getElementById("gradesList");
        if(table) table.innerHTML='<tr><td colspan="4" class="text-center text-danger">Failed to load grades.</td></tr>';
    })
}

function loadCurrentCourses() {
    const listDiv = document.getElementById('currentCoursesList');
    if(!listDiv) return;

    const studentId = getCurrentStudentId();

    apiGet("/enrollments").then(data=>{

    const enrollments = Array.isArray(data)
        ? data.filter(e => Number(e.studentId) === Number(studentId))
        : [];
        const courseMap = studentCourses.reduce((acc,c)=>{acc[c.courseId]=c;return acc;}, {});

        if (enrollments.length === 0) {
            listDiv.innerHTML = '<p class="text-muted">No current courses found.</p>';
            return;
        }

        const courseIds = [...new Set(enrollments
        .filter(e => !e.grade)
        .map(e => e.courseId)
        )];
        if (courseIds.length === 0) {
            listDiv.innerHTML = '<p class="text-muted">No current courses found.</p>';
            return;
        }

        listDiv.innerHTML = '';
        const list = document.createElement('ul');
        list.className = 'list-group';
        courseIds.forEach(id => {
            const course = courseMap[id];
            const label = course ? `${course.courseCode || 'N/A'} - ${course.courseName || 'N/A'}` : `Course ${id}`;
            const item = document.createElement('li');
            item.className = 'list-group-item';
            item.textContent = label;
            list.appendChild(item);
        });
        listDiv.appendChild(list);
    }).catch(err => {
        console.error(err);
        if (listDiv) listDiv.innerHTML = '<p class="text-danger">Failed to load current courses.</p>';
    });
}

function convertGradeToPoints(grade) {
    const gradePoints = {
        'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 
        'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'F': 0
    };
    return gradePoints[grade] || 0;
}

function updateStudentDashboardStats() {
    const totalCoursesEl = document.getElementById("totalCourses");
    const completedCoursesEl = document.getElementById("completedCourses");
    const gpaEl = document.getElementById("gpaValue");
    const currentCoursesEl = document.getElementById("currentCourses");
    const semesterGpaEl = document.getElementById("semesterGpa");
    const cumulativeGpaEl = document.getElementById("cumulativeGpa");
    const creditsCompletedEl = document.getElementById("creditsCompleted");

    if (!studentEnrollments || studentEnrollments.length === 0) {
        if (totalCoursesEl) totalCoursesEl.textContent = "0";
        if (completedCoursesEl) completedCoursesEl.textContent = "0";
        if (gpaEl) gpaEl.textContent = "0.00";
        if (currentCoursesEl) currentCoursesEl.textContent = "0";
        if (semesterGpaEl) semesterGpaEl.textContent = "0.00";
        if (cumulativeGpaEl) cumulativeGpaEl.textContent = "0.00";
        if (creditsCompletedEl) creditsCompletedEl.textContent = "0";
        return;
    }

    const courseMap = studentCourses.reduce((acc,c)=>{acc[c.courseId]=c;return acc;}, {});

    const allCourseIds = [...new Set(studentEnrollments.map(e => e.courseId))];

    const completedCourseIds = [...new Set(
        studentEnrollments
            .filter(e => e.grade && e.grade !== "")
            .map(e => e.courseId)
    )];

    let totalCredits = 0;
    let totalPoints = 0;

    studentEnrollments.forEach(e => {
        if (!e.grade || e.grade === "") return;
        const c = courseMap[e.courseId];
        const credits = c && c.credits ? c.credits : 0;
        const pts = convertGradeToPoints(e.grade);
        totalCredits += credits;
        totalPoints += credits * pts;
    });

    const cumulativeGpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;

    const semesters = [...new Set(
        studentEnrollments
            .map(e => e.semester)
            .filter(s => s && s.length)
    )].sort();
    const latestSemester = semesters.length ? semesters[semesters.length - 1] : null;

    let semCredits = 0;
    let semPoints = 0;
    if (latestSemester) {
        studentEnrollments.forEach(e => {
            if (e.semester !== latestSemester || !e.grade || e.grade === "") return;
            const c = courseMap[e.courseId];
            const credits = c && c.credits ? c.credits : 0;
            const pts = convertGradeToPoints(e.grade);
            semCredits += credits;
            semPoints += credits * pts;
        });
    }
    const semesterGpa = semCredits > 0 ? (semPoints / semCredits) : cumulativeGpa;

    const creditsCompleted = totalCredits;

    if (totalCoursesEl) totalCoursesEl.textContent = String(allCourseIds.length);
    if (completedCoursesEl) completedCoursesEl.textContent = String(completedCourseIds.length);
    if (gpaEl) gpaEl.textContent = semesterGpa.toFixed(2);
    if (currentCoursesEl) currentCoursesEl.textContent = String(allCourseIds.length - completedCourseIds.length);
    if (semesterGpaEl) semesterGpaEl.textContent = semesterGpa.toFixed(2);
    if (cumulativeGpaEl) cumulativeGpaEl.textContent = cumulativeGpa.toFixed(2);
    if (creditsCompletedEl) creditsCompletedEl.textContent = String(creditsCompleted);
}

function exportStudentResults() {
    if (!studentEnrollments || studentEnrollments.length === 0) {
        alert("No results to export yet.");
        return;
    }

    const courseMap = studentCourses.reduce((acc, c) => {
        acc[c.courseId] = c;
        return acc;
    }, {});

    const headers = ["Course Code", "Course Name", "Semester", "Grade", "Points"];
    const rows = [headers.join(",")];

    studentEnrollments.forEach(e => {
        const course = courseMap[e.courseId];
        const code = course && course.courseCode ? course.courseCode : "";
        const name = course && course.courseName ? course.courseName : "";
        const semester = e.semester || "";
        const grade = e.grade || "";
        const points = grade ? convertGradeToPoints(grade) : "";
        rows.push([code, name, semester, grade, points].join(","));
    });

    const csvContent = rows.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "student_results.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Initialize on page load
window.addEventListener('load', function() {
    loadStudentProfile().then(() => {
        loadStudents();
        loadCourses();
        loadEnrollments();
        loadGrades();
        loadCurrentCourses();
    });
})