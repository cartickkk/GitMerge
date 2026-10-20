// frontend/js/config.js

// Central Backend Endpoint configuration
const CONFIG = {
    API_BASE_URL: "http://localhost:8080/api",
    DEFAULT_STORAGE_KEY: "gitmerge_active_user"
};

// Global helper to get the currently logged-in user
function getActiveUser() {
    const user = localStorage.getItem(CONFIG.DEFAULT_STORAGE_KEY);
    return user ? JSON.parse(user) : null;
}

// Global helper to store logged-in user session
function setActiveUser(userData) {
    localStorage.setItem(CONFIG.DEFAULT_STORAGE_KEY, JSON.stringify(userData));
}

// Global helper to log out
function logoutUser() {
    localStorage.removeItem(CONFIG.DEFAULT_STORAGE_KEY);
    window.location.href = window.location.pathname.includes('/pages/') 
        ? 'login.html' 
        : 'pages/login.html';
}