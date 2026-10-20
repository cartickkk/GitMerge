// frontend/js/login.js

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const statusMessage = document.getElementById("statusMessage");

    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            updateStatus("Please enter both username and password.", "error");
            return;
        }

        updateStatus("Contacting GitMerge engine on port 8080...", "pending");

        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.status === "success") {
                updateStatus("Authentication successful! Merging to squads...", "success");
                
                // Store user session in localStorage
                setActiveUser({
                    username: username,
                    name: data.name || username,
                    role: data.role || "Developer"
                });

                // Smooth redirect to index directory after 800ms
                setTimeout(() => {
                    window.location.href = "../index.html";
                }, 800);
            } else {
                updateStatus(data.message || "Invalid credentials. Check user.txt", "error");
            }
        } catch (error) {
            console.warn("Backend not running yet. Simulating local development login...");
            
            // Fallback development mode if C++ server is still being built
            setActiveUser({
                username: username,
                name: username,
                role: "Solo Developer"
            });
            updateStatus("Local bypass active. Redirecting...", "success");
            setTimeout(() => {
                window.location.href = "../index.html";
            }, 800);
        }
    });

    function updateStatus(text, type) {
        if (!statusMessage) return;
        statusMessage.textContent = text;
        statusMessage.style.display = "block";
        if (type === "error") {
            statusMessage.style.color = "#ff7b72";
        } else if (type === "success") {
            statusMessage.style.color = "#3fb950";
        } else {
            statusMessage.style.color = "var(--text-cream)";
        }
    }
});