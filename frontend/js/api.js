const API_URL = "http://localhost:8080";

function handleResponse(res) {
    if (!res.ok) {
        return res.text().then(text => {
            let errorMsg = text;
            try {
                const parsed = JSON.parse(text);
                errorMsg = parsed.message || JSON.stringify(parsed);
            } catch (_) {}
            throw new Error(errorMsg || `HTTP ${res.status}`);
        });
    }
    return res.json();
}

function apiGet(endpoint) {
    return fetch(API_URL + endpoint, {
        headers: {
            "Authorization": localStorage.getItem("token") || ""
        }
    }).then(handleResponse);
}

function apiPost(endpoint, data) {
    return fetch(API_URL + endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token") || ""
        },
        body: JSON.stringify(data)
    }).then(handleResponse);
}

// Helper for simple form-style POST/PUT (x-www-form-urlencoded)
function apiPostForm(endpoint, data, method = "POST") {
    const params = new URLSearchParams();
    Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
            params.append(key, data[key]);
        }
    });

    return fetch(API_URL + endpoint, {
        method,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": localStorage.getItem("token") || ""
        },
        body: params.toString()
    }).then(handleResponse);
}

function apiDelete(endpoint) {
    return fetch(API_URL + endpoint, {
        method: "DELETE",
        headers: {
            "Authorization": localStorage.getItem("token") || ""
        }
    }).then(handleResponse);
}