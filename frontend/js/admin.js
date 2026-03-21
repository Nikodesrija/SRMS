// Admin Dashboard Functions

let adminUsersCache = [];
let adminStudentsCache = [];
let adminCoursesCache = [];


/* ---------------- USERS ---------------- */

function formatDate(dateString){
    if(!dateString) return "-";
    try{
        const d = new Date(dateString);
        return d.toLocaleString();
    }catch(e){
        return dateString;
    }
}

function renderUsers(list) {

    const table = document.getElementById("usersList");
    if (!table) return;

    if (!list.length) {
        table.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No users found.</td></tr>';
        return;
    }

    table.innerHTML = "";

    list.forEach(u => {

        const status = (u.status === true || u.status === "Active") ? "Active" : "Inactive";

        const statusBadge =
            status === "Active"
            ? '<span class="badge badge-success">Active</span>'
            : '<span class="badge badge-secondary">Inactive</span>';

        const row = `
        <tr>
            <td>${u.userId || ""}</td>
            <td>${u.username || ""}</td>
            <td><span class="badge badge-info">${u.role || ""}</span></td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-sm btn-primary mr-1" onclick="openUserModal(${u.userId})">Edit</button>
                <button class="btn btn-sm btn-warning mr-1" onclick="resetUserPassword(${u.userId})">Reset Pass</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser(${u.userId})">Delete</button>
            </td>
        </tr>`;

        table.innerHTML += row;
    });
}

function loadUsersForAdmin() {
    apiGet("/users")
        .then(data => {
            adminUsersCache = Array.isArray(data) ? data : [];
            renderUsers(adminUsersCache);
        })
        .catch(err => console.error(err));
}


/* ---------------- STUDENTS ---------------- */

function renderStudentsForAdmin(list) {

    const table = document.getElementById("studentsList");
    if (!table) return;

    if (!Array.isArray(list) || !list.length) {
        table.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No students found.</td></tr>';
        return;
    }

    table.innerHTML = "";

    list.forEach(s => {

       const statusBadge =
    s.status === "Inactive"
    ? '<span class="badge badge-danger p-2">Inactive</span>'
    : s.status === "Alumni"
    ? '<span class="badge badge-dark p-2">Alumni</span>'
    : '<span class="badge badge-success p-2">Active</span>';

        const row = `
        <tr>
            <td>${s.studentId || ""}</td>
            <td>${(s.firstName || "") + " " + (s.lastName || "")}</td>
            <td>${s.email || ""}</td>
            <td>${s.department || ""}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-sm btn-primary mr-1" onclick="editStudent(${s.studentId})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteStudent(${s.studentId})">Delete</button>
            </td>
        </tr>`;

        table.innerHTML += row;
    });
}

function loadStudentsForAdmin() {
    apiGet("/students")
        .then(data => {
            adminStudentsCache = Array.isArray(data) ? data : [];
            renderStudentsForAdmin(adminStudentsCache);
        })
        .catch(err => console.error(err));
}
function editStudent(studentId){

    const student = adminStudentsCache.find(s => Number(s.studentId) === Number(studentId));

    if(!student) return;

    document.getElementById("studentId").value = student.studentId || "";
    document.getElementById("firstName").value = student.firstName || "";
    document.getElementById("lastName").value = student.lastName || "";
    document.getElementById("email").value = student.email || "";
    document.getElementById("phone").value = student.phone || "";
    document.getElementById("department").value = student.department || "";
    document.getElementById("enrollmentYear").value = student.enrollmentYear || "";
    document.getElementById("status").value = student.status || "Active";

    const card = document.getElementById("studentFormCard");

    if(card){
        card.classList.remove("d-none");
        card.scrollIntoView({behavior:"smooth"});
    }

}
function deleteStudent(studentId){

    // 🔹 Find student from cache
    const student = adminStudentsCache.find(
        s => Number(s.studentId) === Number(studentId)
    );

    // 🔹 Create full name
    const name = student 
        ? (student.firstName || "") + " " + (student.lastName || "")
        : "this student";

    // 🔹 Dynamic confirm message
    if(!confirm("Delete " + name.trim() + "?")) return;

    apiDelete("/students?id=" + encodeURIComponent(studentId))
    .then(()=>{

        adminStudentsCache = adminStudentsCache.filter(
            s => Number(s.studentId) !== Number(studentId)
        );

        renderStudentsForAdmin(adminStudentsCache);

        loadStats();
        loadAnalytics();

    })
    .catch(err=>{
        console.error(err);
        alert("Failed to delete student");
    });

}
function resetStudentForm(){

    document.getElementById("studentId").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("department").value = "";
    document.getElementById("enrollmentYear").value = "";
    document.getElementById("status").value = "Active";

}
function showStudentForm(){

    const card = document.getElementById("studentFormCard");

    if(!card) return;

    if(card.classList.contains("d-none")){

        resetStudentForm();
        card.classList.remove("d-none");
        card.scrollIntoView({behavior:"smooth"});

    }else{

        card.classList.add("d-none");

    }

}
function hideStudentForm(){

    const card = document.getElementById("studentFormCard");

    if(card){
        card.classList.add("d-none");
    }

}
function handleStudentFormSubmit(e){

    e.preventDefault();

    const id = document.getElementById("studentId").value;

    const payload = {

        studentId: id || undefined,
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        department: document.getElementById("department").value.trim(),
        enrollmentYear: document.getElementById("enrollmentYear").value,
        status: document.getElementById("status").value

    };

    const method = id ? "PUT" : "POST";

    apiPostForm("/students", payload, method)
        .then(()=>{

            hideStudentForm();

            loadStudentsForAdmin();
            loadStats();
            loadAnalytics();

        })
        .catch(err=>{
            console.error(err);
            alert("Failed to save student");
        });

}
/* ---------------- USER MODAL ---------------- */

function openUserModal(userId) {

    const modal = $('#userModal');
    const form = document.getElementById('userForm');

    if (!form) return;

    if (userId) {

        const user = adminUsersCache.find(u => u.userId === userId);
        if (!user) return;

        document.getElementById('userId').value = user.userId || "";
        document.getElementById('username').value = user.username || "";
        document.getElementById('password').value = "";
        document.getElementById('role').value = user.role || "student";

    } else {

        resetUserForm();

    }

    modal.modal('show');
}

function resetUserForm() {

    document.getElementById('userId').value = "";
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
    document.getElementById('role').value = "student";

}

function handleUserFormSubmit(e) {

    e.preventDefault();

    const id = document.getElementById('userId').value;
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    if (!username) {
        alert('Username is required');
        return;
    }

    const payload = {
        userId: id || undefined,
        username,
        role
    };

    if (password) payload.password = password;

    const method = id ? 'PUT' : 'POST';

    apiPostForm('/users', payload, method)
        .then(() => {
            $('#userModal').modal('hide');
            loadUsersForAdmin();
        })
        .catch(err => {
            console.error(err);
            alert('Failed to save user');
        });
}

function resetUserPassword(userId) {

    if (!confirm('Reset password for this user to default (pass123)?')) return;

    apiPostForm('/users', { userId, password: 'pass123' }, 'PUT')
        .then(() => alert('Password reset to pass123'))
        .catch(err => {
            console.error(err);
            alert('Failed to reset password');
        });
}

function deleteUser(userId){

    // 🔹 Find user
    const user = adminUsersCache.find(
        u => Number(u.userId) === Number(userId)
    );

    // 🔹 Get name (username)
    const name = user ? user.username : "this user";

    // 🔹 Confirm
    if(!confirm("Delete " + name + "?")) return;

    apiDelete('/users?id=' + encodeURIComponent(userId))
    .then(()=>{

        adminUsersCache = adminUsersCache.filter(
            u => Number(u.userId) !== Number(userId)
        );

        renderUsers(adminUsersCache);

    })
    .catch(err=>{
        console.error(err);
        alert("Failed to delete user");
    });

}


/* ---------------- COURSES ---------------- */

function renderCourses(list) {

    const table = document.getElementById("coursesList");
    if (!table) return;

    if (!list.length) {
        table.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No courses found.</td></tr>';
        return;
    }

    table.innerHTML = "";

    list.forEach(c => {

        const instructor = c.instructorName || c.instructor || "Faculty";

        const row = `
        <tr>
            <td>${c.courseCode || "N/A"}</td>
            <td>${c.courseName || "N/A"}</td>
            <td>${c.credits != null ? c.credits : "-"}</td>
            <td>${instructor}</td>
            <td><span class="badge badge-success">Active</span></td>
            <td>
                <button class="btn btn-sm btn-primary mr-1" onclick="openCourseModal(${c.courseId})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteCourse(${c.courseId})">Delete</button>
            </td>
        </tr>`;

        table.innerHTML += row;
    });
}

function loadCoursesForAdmin() {

    apiGet("/courses")
        .then(data => {
            adminCoursesCache = Array.isArray(data) ? data : [];
            renderCourses(adminCoursesCache);
        })
        .catch(err => console.error(err));
}

function openCourseModal(courseId) {
    const modal = $('#courseModal');

    if (courseId) {
        const numericId = Number(courseId);
        const course = adminCoursesCache.find(c => Number(c.courseId) === numericId);
        if (course) {
            document.getElementById('courseId').value = course.courseId || "";
            document.getElementById('courseName').value = course.courseName || "";
            document.getElementById('courseCode').value = course.courseCode || "";
            document.getElementById('credits').value = course.credits || "";
            document.getElementById('department').value = course.department || "";
        }
    } else {
        resetCourseForm();
    }

    modal.modal('show');
}

function resetCourseForm() {
    document.getElementById('courseId').value = "";
    document.getElementById('courseName').value = "";
    document.getElementById('courseCode').value = "";
    document.getElementById('credits').value = "";
    document.getElementById('department').value = "";
}

function handleCourseFormSubmit(e) {
    e.preventDefault();

    const courseId = document.getElementById('courseId').value;
    const courseName = document.getElementById('courseName').value.trim();
    const courseCode = document.getElementById('courseCode').value.trim();
    const credits = Number(document.getElementById('credits').value);
    const department = document.getElementById('department').value.trim();

    if (!courseName || !courseCode) {
        alert('Course name and code are required.');
        return;
    }

    const payload = {
        courseId: courseId ? Number(courseId) : undefined,
        courseName,
        courseCode,
        credits: !Number.isNaN(credits) ? credits : 0,
        department
    };

    const method = courseId ? 'PUT' : 'POST';

    apiPostForm('/courses', payload, method)
        .then(() => {
            $('#courseModal').modal('hide');
            loadCoursesForAdmin();
            loadStats();
            loadAnalytics();
        })
        .catch(err => {
            console.error(err);
            alert('Failed to save course.');
        });
}
function deleteCourse(courseId){

    const course = adminCoursesCache.find(
        c => Number(c.courseId) === Number(courseId)
    );

    const name = course 
        ? (course.courseName || "this course") 
        : "this course";

    if(!confirm("Delete " + name + "?")) return;

    const numericId = Number(courseId);

    apiDelete("/courses?id=" + numericId)

    .then(()=>{

        adminCoursesCache = adminCoursesCache.filter(
            c => Number(c.courseId) !== numericId
        );

        renderCourses(adminCoursesCache);

        loadStats();

    })

    .catch(err=>{
        console.error(err);
        alert("Failed to delete course");
    });

}


/* ---------------- INITIALIZATION ---------------- */

document.addEventListener('DOMContentLoaded', function() {

    loadUsersForAdmin();
    loadStudentsForAdmin();
    loadCoursesForAdmin();

    const searchInput = document.getElementById("studentSearchInput");

    if (searchInput) {

        searchInput.addEventListener("input", e => {

            const q = e.target.value.toLowerCase();

            const filtered = adminStudentsCache.filter(s => {

                const name = ((s.firstName || "") + " " + (s.lastName || "")).toLowerCase();
                const email = (s.email || "").toLowerCase();
                const dept = (s.department || "").toLowerCase();

                return name.includes(q) || email.includes(q) || dept.includes(q);

            });

            renderStudentsForAdmin(filtered);

        });

    }

});


function generateReport(type){

    if(type==="users"){

        apiGet("/users").then(data=>{
            downloadCSV(data,"users-report");
        });

    }

    if(type==="academic"){

        apiGet("/students").then(data=>{
            downloadCSV(data,"academic-report");
        });

    }

}

function downloadCSV(data,fileName){

    if(!data.length){
        alert("No data to export");
        return;
    }

    let csv = Object.keys(data[0]).join(",") + "\n";

    data.forEach(row=>{
        csv += Object.values(row).join(",") + "\n";
    });

    const blob = new Blob([csv],{type:"text/csv"});

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = fileName + ".csv";

    link.click();
}