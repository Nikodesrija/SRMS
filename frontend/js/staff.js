// Staff Dashboard Functions

let staffStudents = [];

function loadStudentsForStaff() {
    apiGet("/students").then(data=>{
        staffStudents = Array.isArray(data) ? data : [];
        let table=document.getElementById("studentsList")
        if(!table) return;
        
        if (staffStudents.length === 0) {
            table.innerHTML = '<tr><td colspan="6" class="text-center">No students found.</td></tr>';
            return;
        }

        table.innerHTML=""
        staffStudents.forEach(s=>{
            let row=`<tr>
            <td>${s.studentId || 'N/A'}</td>
            <td>${s.firstName || 'N/A'} ${s.lastName || ''}</td>
            <td>${s.email || 'N/A'}</td>
            <td>${s.department || 'N/A'}</td>
            <td><span class="badge badge-success">${s.status || 'Active'}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editStaffStudent(${s.studentId})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteStaffStudent(${s.studentId})">Delete</button>
            </td>
            </tr>`
            table.innerHTML+=row
        })
    }).catch(err => console.error(err))
}

function editStaffStudent(studentId) {
    const student = staffStudents.find(s => s.studentId === studentId);
    if (!student) return alert('Student not found');

    const firstName = prompt('First name:', student.firstName || '');
    if (firstName === null) return;

    const lastName = prompt('Last name:', student.lastName || '');
    if (lastName === null) return;

    const email = prompt('Email:', student.email || '');
    if (email === null) return;

    const department = prompt('Department:', student.department || '');
    if (department === null) return;

    apiPostForm('/students', {
        studentId: studentId,
        firstName,
        lastName,
        email,
        department,
        status: student.status || 'Active'
    }, 'PUT')
    .then(() => loadStudentsForStaff())
    .catch(err => {
        console.error(err);
        alert('Failed to update student');
    });
}

function deleteStaffStudent(studentId){

    const student = staffStudents.find(
        s => Number(s.studentId) === Number(studentId)
    );

    const name = student
        ? ((student.firstName || "") + " " + (student.lastName || "")).trim()
        : "this student";

    if(!confirm("Delete " + name + "?")) return;

    apiDelete(`/students?id=${studentId}`)
    .then(res=>{
        if (!res.success) throw new Error(res.message || 'Failed to delete student');

        staffStudents = staffStudents.filter(
            s => Number(s.studentId) !== Number(studentId)
        );

        loadStudentsForStaff();
    })
    .catch(err=>{
        console.error(err);
        alert(err.message || "Failed to delete student");
    });

}

function addStaffStudent() {
    const firstName = prompt('First name:');
    if (!firstName) return;

    const lastName = prompt('Last name:');
    if (lastName === null) return;

    const email = prompt('Email:');
    if (email === null) return;

    const department = prompt('Department:');
    if (department === null) return;

    apiPostForm('/students', {
        firstName,
        lastName,
        email,
        department,
        status: 'Active'
    })
    .then(() => loadStudentsForStaff())
    .catch(err => {
        console.error(err);
        alert('Failed to add student');
    });
}

let staffCourses = [];

function loadCoursesForStaff() {
    apiGet("/courses").then(data=>{
        staffCourses = Array.isArray(data) ? data : [];
        let table=document.getElementById("coursesList")
        if(!table) return;
        
        if (staffCourses.length === 0) {
            table.innerHTML = '<tr><td colspan="5" class="text-center">No courses found.</td></tr>';
            return;
        }

        table.innerHTML=""
        staffCourses.forEach(c=>{
            const enrolledCount = staffEnrollments.filter(e => e.courseId === c.courseId).length;
            let row=`<tr>
            <td>${c.courseCode || 'N/A'}</td>
            <td>${c.courseName || 'N/A'}</td>
            <td>${c.credits || 'N/A'}</td>
            <td>${enrolledCount}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editStaffCourse(${c.courseId})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteStaffCourse(${c.courseId})">Delete</button>
            </td>
            </tr>`
            table.innerHTML+=row
        })
    }).catch(err => console.error(err))
}

function editStaffCourse(courseId) {
    const course = staffCourses.find(c => c.courseId === courseId);
    if (!course) return alert('Course not found');

    const name = prompt('Course name:', course.courseName || '');
    if (name === null) return;

    const code = prompt('Course code:', course.courseCode || '');
    if (code === null) return;

    const credits = prompt('Credits:', course.credits || '');
    if (credits === null) return;

    apiPostForm('/courses', {
        courseId: courseId,
        courseName: name,
        courseCode: code,
        credits: credits,
        department: course.department || ''
    }, 'PUT')
    .then(() => loadCoursesForStaff())
    .catch(err => {
        console.error(err);
        alert('Failed to update course');
    });
}

function deleteStaffCourse(courseId){

    const course = staffCourses.find(
        c => Number(c.courseId) === Number(courseId)
    );

    const name = course
        ? (course.courseName || "this course")
        : "this course";

    if(!confirm("Delete " + name + "?")) return;

    apiDelete(`/courses?id=${courseId}`)
    .then(res=>{
        if (!res.success) throw new Error(res.message || 'Failed to delete course');

        staffCourses = staffCourses.filter(
            c => Number(c.courseId) !== Number(courseId)
        );

        loadCoursesForStaff();
    })
    .catch(err=>{
        console.error(err);
        alert(err.message || "Failed to delete course");
    });

}

let staffEnrollments = [];

function loadEnrollmentsForStaff() {
    apiGet("/enrollments").then(data=>{
        staffEnrollments = Array.isArray(data) ? data : [];
        let table=document.getElementById("enrollmentsList")
        if(!table) return;
        
        if (staffEnrollments.length === 0) {
            table.innerHTML = '<tr><td colspan="6" class="text-center">No enrollments found.</td></tr>';
            return;
        }
        const studentMap = staffStudents.reduce((acc,s)=>{acc[s.studentId]=s;return acc;},{});
        const courseMap = staffCourses.reduce((acc,c)=>{acc[c.courseId]=c;return acc;},{});

        table.innerHTML=""
        staffEnrollments.forEach(e=>{
            const studentName = studentMap[e.studentId] ? `${studentMap[e.studentId].firstName || ''} ${studentMap[e.studentId].lastName || ''}`.trim() : `Student ${e.studentId}`;
            const courseName = courseMap[e.courseId] ? `${courseMap[e.courseId].courseCode || ''} - ${courseMap[e.courseId].courseName || ''}`.trim() : `Course ${e.courseId}`;
            let row=`<tr>
            <td>${e.enrollmentId}</td>
            <td>${studentName || 'N/A'}</td>
            <td>${courseName || 'N/A'}</td>
            <td>${e.semester || 'N/A'}</td>
            <td><span class="badge badge-info">Active</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editStaffEnrollment(${e.enrollmentId})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteStaffEnrollment(${e.enrollmentId})">Remove</button>
            </td>
            </tr>`
            table.innerHTML+=row
        })
        updateStaffStats();
        // refresh courses so Students Enrolled reflects latest enrollments
        loadCoursesForStaff();
    }).catch(err => console.error(err))
}

function editStaffEnrollment(enrollmentId) {
    const enrollment = staffEnrollments.find(e => e.enrollmentId === enrollmentId);
    if (!enrollment) return alert('Enrollment not found');

    const semester = prompt('Semester:', enrollment.semester || '');
    if (semester === null) return;

    apiPostForm('/enrollments', {
        enrollmentId: enrollmentId,
        studentId: enrollment.studentId,
        courseId: enrollment.courseId,
        semester
    }, 'PUT')
    .then(() => loadEnrollmentsForStaff())
    .catch(err => {
        console.error(err);
        alert('Failed to update enrollment');
    });
}

function deleteStaffEnrollment(enrollmentId){

    const enrollment = staffEnrollments.find(
        e => Number(e.enrollmentId) === Number(enrollmentId)
    );

    let name = "this enrollment";

    if(enrollment){
        const student = staffStudents.find(s => s.studentId === enrollment.studentId);
        const course = staffCourses.find(c => c.courseId === enrollment.courseId);

        const studentName = student
            ? ((student.firstName || "") + " " + (student.lastName || "")).trim()
            : "Student";

        const courseName = course
            ? (course.courseName || "")
            : "Course";

        name = studentName + " → " + courseName;
    }

    if(!confirm("Delete " + name + "?")) return;

    apiDelete(`/enrollments?id=${enrollmentId}`)
    .then(res=>{
        if (!res.success) throw new Error(res.message || 'Failed to delete enrollment');

        staffEnrollments = staffEnrollments.filter(
            e => Number(e.enrollmentId) !== Number(enrollmentId)
        );

        loadEnrollmentsForStaff();
    })
    .catch(err=>{
        console.error(err);
        alert(err.message || "Failed to delete enrollment");
    });

}
function updateStudentGrades() {
    // This function will be called when staff updates grades
    alert('Grade update feature coming soon!');
}

// Grade management helpers
let currentGradeRows = [];

function populateGradeSelectors() {
    // Populate course select
    apiGet('/courses').then(courses => {
        const courseSelect = document.getElementById('courseSelect');
        if (!courseSelect) return;
        courseSelect.innerHTML = '<option value="">-- Select Course --</option>';
        courses.forEach(c => {
            const option = document.createElement('option');
            option.value = c.courseId;
            option.textContent = `${c.courseCode} - ${c.courseName}`;
            courseSelect.appendChild(option);
        });
    }).catch(err => console.error('Failed to load courses for grades', err));
}

function loadGrades() {
    const courseSelect = document.getElementById('courseSelect');
    const semesterSelect = document.getElementById('semesterSelect');
    const gradesList = document.getElementById('gradesList');

    if (!courseSelect || !semesterSelect || !gradesList) return;

    const courseId = parseInt(courseSelect.value);
    const semester = semesterSelect.value;

    if (!courseId || !semester) {
        gradesList.innerHTML = '<tr><td colspan="5" class="text-center">Select course and semester to load grades</td></tr>';
        return;
    }

    Promise.all([apiGet('/enrollments'), apiGet('/students'), apiGet('/courses')])
        .then(([enrollments, students, courses]) => {
            const studentMap = (students || []).reduce((acc, s) => {
                acc[s.studentId] = s;
                return acc;
            }, {});
            const courseMap = (courses || []).reduce((acc, c) => {
                acc[c.courseId] = c;
                return acc;
            }, {});

            const filtered = (enrollments || []).filter(e =>
                e.courseId === courseId && e.semester === semester
            );

            if (filtered.length === 0) {
                gradesList.innerHTML = '<tr><td colspan="5" class="text-center">No grades found for selected course/semester.</td></tr>';
                currentGradeRows = [];
                return;
            }

            currentGradeRows = filtered.map(e => ({
                enrollmentId: e.enrollmentId,
                studentId: e.studentId,
                courseId: e.courseId,
                semester: e.semester,
                grade: e.grade || '',
                studentName: studentMap[e.studentId] ? `${studentMap[e.studentId].firstName || ''} ${studentMap[e.studentId].lastName || ''}`.trim() : `Student ${e.studentId}`,
                courseName: courseMap[e.courseId] ? `${courseMap[e.courseId].courseCode || ''} - ${courseMap[e.courseId].courseName || ''}`.trim() : `Course ${e.courseId}`
            }));

            gradesList.innerHTML = '';
            currentGradeRows.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.studentName || 'N/A'}</td>
                    <td>${row.courseName || 'N/A'}</td>
                    <td>${row.grade || 'N/A'}</td>
                    <td>
                        <select class="form-control form-control-sm" id="gradeSelect_${row.enrollmentId}">
                            <option value="">--</option>
                            <option value="A">A</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B">B</option>
                            <option value="B-">B-</option>
                            <option value="C+">C+</option>
                            <option value="C">C</option>
                            <option value="F">F</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-success" onclick="saveGrade(${row.enrollmentId})">Save</button>
                    </td>
                `;
                gradesList.appendChild(tr);

                const select = tr.querySelector(`#gradeSelect_${row.enrollmentId}`);
                if (select) select.value = row.grade || '';
            });
        })
        .catch(err => {
            console.error('Failed to load grades', err);
            gradesList.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Failed to load grades.</td></tr>';
        });
}

function saveGrade(enrollmentId) {
    const select = document.getElementById(`gradeSelect_${enrollmentId}`);
    if (!select) return;
    const grade = select.value;

    apiPostForm('/results', {
        enrollmentId,
        grade: grade
    }, 'POST')
    .then(res => {
        if (!res.success) throw new Error(res.message || 'Failed to save grade');
        alert('Grade saved successfully');
        loadGrades();
    })
    .catch(err => {
        console.error(err);
        alert(err.message || 'Failed to save grade');
    });
}

function escapeCsv(value) {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (/[",\r\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function exportGradesReport() {
    if (!currentGradeRows || currentGradeRows.length === 0) {
        alert('No grade data to export. Load grades first.');
        return;
    }

    const csvHeaders = ['Student Name', 'Course', 'Semester', 'Grade'];
    const csvRows = [csvHeaders.join(',')];

    currentGradeRows.forEach(row => {
        csvRows.push([
            escapeCsv(row.studentName),
            escapeCsv(row.courseName),
            escapeCsv(row.semester),
            escapeCsv(row.grade || '')
        ].join(','));
    });

    const csvContent = csvRows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `grades_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function updateStaffStats() {
    const totalStudentsEl = document.getElementById("staffTotalStudents");
    const totalCoursesEl = document.getElementById("staffTotalCourses");
    const totalEnrollmentsEl = document.getElementById("staffTotalEnrollments");
    const pendingGradesEl = document.getElementById("staffPendingGrades");

    if (totalStudentsEl) totalStudentsEl.textContent = staffStudents.length;
    if (totalCoursesEl) totalCoursesEl.textContent = staffCourses.length;
    if (totalEnrollmentsEl) totalEnrollmentsEl.textContent = staffEnrollments.length;

    if (pendingGradesEl) {
        const pending = staffEnrollments.filter(e => !e.grade || e.grade === "" || e.grade === null).length;
        pendingGradesEl.textContent = pending;
    }
}

function loadInitialData() {
    loadStudentsForStaff();
    // load courses first so stats have correct course count
    apiGet("/courses").then(data => {
        staffCourses = Array.isArray(data) ? data : [];
        loadEnrollmentsForStaff();
    }).catch(err => {
        console.error(err);
        loadEnrollmentsForStaff();
    });
    populateGradeSelectors();

    const loadGradesBtn = document.getElementById('loadGradesBtn');
    if (loadGradesBtn) {
        loadGradesBtn.addEventListener('click', loadGrades);
    }

    const exportGradesBtn = document.getElementById('exportGradesBtn');
    if (exportGradesBtn) {
        exportGradesBtn.addEventListener('click', exportGradesReport);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    loadInitialData();
});

function handleStaffCourseSubmit(e){

e.preventDefault()

const courseId=document.getElementById("courseId").value
const name=document.getElementById("courseName").value
const code=document.getElementById("courseCode").value
const credits=document.getElementById("credits").value
const department=document.getElementById("department").value

const payload={
courseId:courseId || undefined,
courseName:name,
courseCode:code,
credits:credits,
department:department
}

const method=courseId ? "PUT":"POST"

apiPostForm("/courses",payload,method)

.then(()=>{
$('#courseModal').modal('hide')
loadCoursesForStaff()
})

.catch(err=>{
console.error(err)
alert("Failed to save course")
})

}