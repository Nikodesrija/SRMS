function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const loginBtn = document.getElementById("loginBtn");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const errorMessage = document.getElementById("errorMessage");

    // Show loading state
    loginBtn.style.display = 'none';
    loadingSpinner.classList.remove('d-none');
    errorMessage.classList.add('d-none');

    fetch("http://localhost:8080/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
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
            // Store user info in localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            localStorage.setItem("role", data.role);

            // Redirect based on role
            redirectUserByRole(data.role);
        } else {
            showError(data.message || "Login failed. Please check your credentials.");
            resetLoginForm();
        }
    })
    .catch(error => {
        console.error("Login error:", error);
        showError(error.message || "An error occurred. Please try again.");
        resetLoginForm();
    });
}

function applyLoginPageContext() {
    const titleEl = document.getElementById("loginTitle");
    const subtitleEl = document.getElementById("loginSubtitle");

    if (!titleEl) return; // not on login page

    const params = new URLSearchParams(window.location.search || "");
    const roleParam = (params.get("role") || "").toLowerCase().trim();
    const allowed = new Set(["student", "staff", "admin"]);

    let role = allowed.has(roleParam)
        ? roleParam
        : (localStorage.getItem("loginRole") || "").toLowerCase().trim();

    if (!allowed.has(role)) role = "";
    if (role) localStorage.setItem("loginRole", role);

    const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "SRMS";
    titleEl.textContent = role ? `${roleLabel} Login` : "SRMS Login";
    if (subtitleEl) subtitleEl.textContent = "Student Record Management System";
    document.title = role ? `${roleLabel} Login - SRMS` : "SRMS - Login";
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
    const loginBtn = document.getElementById("loginBtn");
    const loadingSpinner = document.getElementById("loadingSpinner");

    loginBtn.style.display = 'block';
    loadingSpinner.classList.add('d-none');
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    window.location.href = "index.html";
}

function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
    }
    return {
        username: localStorage.getItem("username"),
        role: localStorage.getItem("role"),
        token: token
    };
}

function updateUserInfo() {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    
    const userDisplay = document.getElementById("userDisplay");
    const roleDisplay = document.getElementById("roleDisplay");
    
    if (userDisplay) userDisplay.textContent = username || "User";
    if (roleDisplay) roleDisplay.textContent = role || "User";
}

function showProfile() {
    const username = localStorage.getItem("username") || "User";
    const role = (localStorage.getItem("role") || "Unknown Role").toLowerCase();

    if (!username) {
        alert("No user information available.");
        return;
    }

    let endpoint;
    if (role === "staff") {
        endpoint = "/staff?username=" + encodeURIComponent(username);
    } else if (role === "student") {
        endpoint = "/students?username=" + encodeURIComponent(username);
    } else {
        alert(`Profile\nUsername: ${username}\nRole: ${role}`);
        return;
    }

    apiGet(endpoint)
        .then(res => {
            const data = res.data || res;
            if (!data) {
                alert(`Profile\nUsername: ${username}\nRole: ${role}`);
                return;
            }
            const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim() || "(Name not set)";
            const email = data.email || "N/A";
            const dept = data.department || "N/A";
            alert(`Profile\nName: ${fullName}\nUsername: ${username}\nEmail: ${email}\nDepartment: ${dept}\nRole: ${role}`);
        })
        .catch(() => {
            alert(`Profile\nUsername: ${username}\nRole: ${role}`);
        });
}

document.addEventListener("DOMContentLoaded", applyLoginPageContext);
