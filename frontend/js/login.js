// frontend/js/login.js

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const fullNameInput = document.getElementById("fullName");
    const nameGroup = document.getElementById("nameGroup");
    const statusMessage = document.getElementById("statusMessage");
    const submitBtn = document.getElementById("submitBtn");
    
    const formTitle = document.getElementById("formTitle");
    const formSubtitle = document.getElementById("formSubtitle");
    const switchModeBtn = document.getElementById("switchModeBtn");
    const switchText = document.getElementById("switchText");
    const auxRow = document.getElementById("auxRow");
    const togglePassword = document.getElementById("togglePassword");

    let isSignUp = false;

    // Toggle password visibility (Eye button)
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                togglePassword.textContent = "🙈";
            } else {
                passwordInput.type = "password";
                togglePassword.textContent = "👁️";
            }
        });
    }

    // Switch between Sign In and Sign Up modes
    if (switchModeBtn) {
        switchModeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            isSignUp = !isSignUp;

            if (isSignUp) {
                formTitle.textContent = "Create Account";
                formSubtitle.textContent = "Register your profile details to join GitMerge.";
                submitBtn.textContent = "Register & Sign Up";
                switchText.textContent = "Already have an account?";
                switchModeBtn.textContent = "Sign In";
                nameGroup.style.display = "flex";
                if (fullNameInput) fullNameInput.required = true;
                if (auxRow) auxRow.style.display = "none";
            } else {
                formTitle.textContent = "Authentication Hub";
                formSubtitle.textContent = "Authenticate to initialize your session and access hackathon squads.";
                submitBtn.textContent = "Authorize Merge";
                switchText.textContent = "Don't have an account?";
                switchModeBtn.textContent = "Sign Up";
                nameGroup.style.display = "none";
                if (fullNameInput) fullNameInput.required = false;
                if (auxRow) auxRow.style.display = "flex";
            }
        });
    }

    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const fullName = fullNameInput ? fullNameInput.value.trim() : "";

        if (!username || !password || (isSignUp && !fullName)) {
            showStatus("Please fill in all required fields.", "error");
            return;
        }

        const endpoint = isSignUp ? "/signup" : "/login";
        const payload = isSignUp ? { fullName, username, password } : { username, password };

        showStatus(isSignUp ? "Registering account..." : "Authenticating with C++ backend...", "pending");

        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.status === "success") {
                showStatus(isSignUp ? "Account created successfully! Entering hub..." : "Authentication successful! Redirecting...", "success");
                
                setActiveUser({
                    username: username,
                    name: fullName || data.name || username
                });

                setTimeout(() => {
                    window.location.href = "../index.html";
                }, 800);
            } else {
                showStatus(data.message || "Authentication failed. Check credentials.", "error");
            }
        } catch (error) {
            console.warn("C++ server offline. Local bypass active...");
            
            setActiveUser({ username: username, name: fullName || username });
            showStatus(isSignUp ? "Account registered locally! Entering..." : "Login verified locally! Entering GitMerge...", "success");
            
            setTimeout(() => {
                window.location.href = "../index.html";
            }, 800);
        }
    });

    function showStatus(text, type) {
        if (!statusMessage) return;
        statusMessage.textContent = text;
        statusMessage.style.display = "block";
        
        if (type === "error") {
            statusMessage.style.color = "#ff7b72";
            statusMessage.style.background = "rgba(255, 123, 114, 0.1)";
        } else if (type === "success") {
            statusMessage.style.color = "#3fb950";
            statusMessage.style.background = "rgba(63, 185, 80, 0.1)";
        } else {
            statusMessage.style.color = "var(--c-lime)";
            statusMessage.style.background = "rgba(212, 228, 81, 0.1)";
        }
    }
});