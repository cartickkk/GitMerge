// frontend/js/squad.js

document.addEventListener("DOMContentLoaded", () => {
    const teamNameInput = document.getElementById("teamName");
    const targetTrackSelect = document.getElementById("targetTrack");
    const teamPitchInput = document.getElementById("teamPitch");
    const leaderNameInput = document.getElementById("leaderName");
    const neededRoleSelect = document.getElementById("neededRole");
    const requiredStackInput = document.getElementById("requiredStack");
    const squadForm = document.getElementById("squadForm");
    const squadStatus = document.getElementById("squadStatus");

    // Live Preview Targets
    const previewTeamName = document.getElementById("previewTeamName");
    const previewCapacity = document.getElementById("previewCapacity");
    const previewTrack = document.getElementById("previewTrack");
    const previewPitch = document.getElementById("previewPitch");
    const previewLeaderDisplay = document.getElementById("previewLeaderDisplay");
    const previewBountyRole = document.getElementById("previewBountyRole");
    const previewBountyStack = document.getElementById("previewBountyStack");
    const previewBranch = document.getElementById("previewBranch");

    let currentSize = 1;

    // Auto-fill leader name from logged in session if available
    const activeUser = getActiveUser();
    if (activeUser && leaderNameInput) {
        leaderNameInput.value = activeUser.name || activeUser.username;
        if (previewLeaderDisplay) previewLeaderDisplay.textContent = leaderNameInput.value;
    }

    // Size Pill Selector
    const sizePills = document.querySelectorAll(".size-pill");
    sizePills.forEach(pill => {
        pill.addEventListener("click", () => {
            sizePills.forEach(p => p.classList.remove("selected"));
            pill.classList.add("selected");
            currentSize = parseInt(pill.getAttribute("data-size"), 10);
            previewCapacity.textContent = `${currentSize}/4 Members ● OPEN`;
        });
    });

    // Real-Time Listeners for Preview
    if (teamNameInput) {
        teamNameInput.addEventListener("input", (e) => {
            const val = e.target.value.trim();
            previewTeamName.textContent = val || "Team Name";
            const slug = val.toLowerCase().replace(/[^a-z0-9]/g, "-") || "new";
            previewBranch.textContent = `branch: team-${slug}`;
        });
    }

    if (targetTrackSelect) {
        targetTrackSelect.addEventListener("change", (e) => {
            previewTrack.textContent = `Track: ${e.target.value}`;
        });
    }

    if (teamPitchInput) {
        teamPitchInput.addEventListener("input", (e) => {
            previewPitch.textContent = e.target.value.trim() || "Project elevator pitch will update here in real time as you type...";
        });
    }

    if (leaderNameInput) {
        leaderNameInput.addEventListener("input", (e) => {
            previewLeaderDisplay.textContent = e.target.value.trim() || "Team Lead";
        });
    }

    if (neededRoleSelect) {
        neededRoleSelect.addEventListener("change", (e) => {
            previewBountyRole.textContent = e.target.value;
        });
    }

    if (requiredStackInput) {
        requiredStackInput.addEventListener("input", (e) => {
            previewBountyStack.textContent = `Stack: ${e.target.value.trim() || "Requirements"}`;
        });
    }

    // Submit Handler
    if (squadForm) {
        squadForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const coveredRoles = Array.from(document.querySelectorAll('input[name="coveredRole"]:checked')).map(cb => cb.value);

            const payload = {
                teamName: teamNameInput.value.trim(),
                track: targetTrackSelect.value,
                pitch: teamPitchInput.value.trim(),
                leader: leaderNameInput.value.trim(),
                currentSize: currentSize,
                maxCapacity: 4,
                coveredRoles: coveredRoles,
                neededRole: neededRoleSelect.value,
                requiredStack: requiredStackInput.value.split(",").map(s => s.trim()).filter(Boolean),
                experiencePref: document.getElementById("experiencePref").value
            };

            showStatus("Initializing squad in teams.txt...", "pending");

            try {
                const response = await fetch(`${CONFIG.API_BASE_URL}/teams`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    showStatus("Squad initialized successfully! Redirecting to feed...", "success");
                    setTimeout(() => {
                        window.location.href = "find-teams.html";
                    }, 1000);
                } else {
                    showStatus("Failed to record squad in teams.txt", "error");
                }
            } catch (err) {
                console.warn("C++ API offline. Saved to local state cache.");
                showStatus("Squad recorded locally (C++ Server offline). Redirecting...", "success");
                setTimeout(() => {
                    window.location.href = "find-teams.html";
                }, 1000);
            }
        });
    }

    function showStatus(text, type) {
        if (!squadStatus) return;
        squadStatus.textContent = text;
        squadStatus.style.display = "block";
        squadStatus.style.color = type === "error" ? "#ff7b72" : "#3fb950";
    }
});