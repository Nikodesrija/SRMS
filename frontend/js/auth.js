function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const loginBtn = document.getElementById("loginBtn");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const errorMessage = document.getElementById("errorMessage");

    loginBtn.style.display = 'none';
    loadingSpinner.classList.remove('d-none');
    errorMessage.classList.add('d-none');

    fetch("http://localhost:8080/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: username + "," + password
    })
    .then(async res => {
        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            throw new Error(text);
        }
    })
    .then(data => {
        if (data.success) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            localStorage.setItem("role", data.role);
            redirectUserByRole(data.role);
        } else {
            showError(data.message || "Login failed");
            resetLoginForm();
        }
    })
    .catch(error => {
        console.error("Login error:", error);
        showError("Server error");
        resetLoginForm();
    });
}

function applyLoginPageContext() {
    const titleEl = document.getElementById("loginTitle");
    if (!titleEl) return;

    document.title = "SRMS - Login";
}

function redirectUserByRole(role) {
    switch(role.toLowerCase()) {
        case 'student':
            window.location.href = "student-dashboard.html";
            break;
        case 'staff':
            window.location.href = "staff-dashboard.html";
            break;
        case 'admin':
            window.location.href = "admin-dashboard.html";
            break;
        default:
            window.location.href = "index.html";
    }
}

function showError(message) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = message;
    errorMessage.classList.remove('d-none');
}

function resetLoginForm() {
    document.getElementById("loginBtn").style.display = 'block';
    document.getElementById("loadingSpinner").classList.add('d-none');
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "login.html";

    return {
        username: localStorage.getItem("username"),
        role: localStorage.getItem("role"),
        token: token
    };
}

/* ✅ FIXED FUNCTION */
function updateUserInfo() {
    const username = localStorage.getItem("username");
    const role = (localStorage.getItem("role") || "").toLowerCase();
    const userDisplay = document.getElementById("userDisplay");

    if (!userDisplay) return;

    if (role === "staff") {
        apiGet("/staff?username=" + encodeURIComponent(username))
        .then(res => {
            const data = res.data || res;
            const fullName = ((data.firstName || "") + " " + (data.lastName || "")).trim();
            userDisplay.textContent = fullName || username;
        })
        .catch(() => userDisplay.textContent = username);
    }

    else if (role === "student") {
        apiGet("/students?username=" + encodeURIComponent(username))
        .then(res => {
            const data = res.data || res;
            const fullName = ((data.firstName || "") + " " + (data.lastName || "")).trim();
            userDisplay.textContent = fullName || username;
        })
        .catch(() => userDisplay.textContent = username);
    }

    else {
        userDisplay.textContent = username || "User";
    }
}

function showProfile() {
    const username = localStorage.getItem("username");
    const role = (localStorage.getItem("role") || "").toLowerCase();

    let endpoint = role === "staff"
        ? "/staff?username=" + username
        : "/students?username=" + username;

    apiGet(endpoint)
    .then(res => {
        const data = res.data || res;

        alert(`👤 Profile
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Department: ${data.department}
Username: ${username}
Role: ${role}`);
    })
    .catch(() => alert("Failed to load profile"));
}

/* ✅ LOAD */
document.addEventListener("DOMContentLoaded", function () {
    applyLoginPageContext();
    updateUserInfo();
});