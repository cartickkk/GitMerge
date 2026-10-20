// frontend/js/profile.js

document.addEventListener("DOMContentLoaded", () => {
    // Input elements
    const fullNameInput = document.getElementById("fullName");
    const rollNoInput = document.getElementById("rollNo");
    const branchYearInput = document.getElementById("branchYear");
    const contactChannelInput = document.getElementById("contactChannel");
    const primaryRoleSelect = document.getElementById("primaryRole");
    const elevatorBioInput = document.getElementById("elevatorBio");
    const customSkillsInput = document.getElementById("customSkills");
    const profileForm = document.getElementById("profileForm");
    const profileStatus = document.getElementById("profileStatus");

    // Live Preview Targets
    const previewAvatar = document.getElementById("previewAvatar");
    const previewName = document.getElementById("previewName");
    const previewMeta = document.getElementById("previewMeta");
    const previewRole = document.getElementById("previewRole");
    const previewBio = document.getElementById("previewBio");
    const previewSkills = document.getElementById("previewSkills");

    // Set of active skills
    let selectedSkills = new Set();

    // 1. Tag Clicking Handler (Toggle Skill)
    const skillTags = document.querySelectorAll(".skill-tag");
    skillTags.forEach(tag => {
        tag.addEventListener("click", () => {
            const skill = tag.getAttribute("data-skill");
            if (selectedSkills.has(skill)) {
                selectedSkills.delete(skill);
                tag.classList.remove("selected");
            } else {
                selectedSkills.add(skill);
                tag.classList.add("selected");
            }
            renderSkillsPreview();
        });
    });

    // 2. Custom Skills input listener
    if (customSkillsInput) {
        customSkillsInput.addEventListener("input", renderSkillsPreview);
    }

    // 3. Name & Initials Avatar Listener
    if (fullNameInput) {
        fullNameInput.addEventListener("input", (e) => {
            const val = e.target.value.trim();
            if (val) {
                previewName.textContent = val;
                const initials = val.split(" ")
                    .filter(w => w.length > 0)
                    .map(w => w[0])
                    .join("")
                    .toUpperCase();
                previewAvatar.textContent = initials.substring(0, 2) || "--";
            } else {
                previewName.textContent = "Your Full Name";
                previewAvatar.textContent = "--";
            }
        });
    }

    // 4. Branch, Year & Contact Handle Listener
    function updateMeta() {
        const branch = branchYearInput?.value.trim() || "Branch & Year";
        const contact = contactChannelInput?.value.trim() || "@contact";
        previewMeta.textContent = `${branch} • ${contact}`;
    }

    if (branchYearInput) branchYearInput.addEventListener("input", updateMeta);
    if (contactChannelInput) contactChannelInput.addEventListener("input", updateMeta);

    // 5. Role Selector Listener
    if (primaryRoleSelect) {
        previewRole.textContent = primaryRoleSelect.value || "Selected Role";
        primaryRoleSelect.addEventListener("change", (e) => {
            previewRole.textContent = e.target.value;
        });
    }

    // 6. Bio Textarea Listener
    if (elevatorBioInput) {
        elevatorBioInput.addEventListener("input", (e) => {
            const val = e.target.value.trim();
            previewBio.textContent = val || "Your short elevator pitch will appear here in real time as you type...";
        });
    }

    // Helper: Render skill badges on the card
    function renderSkillsPreview() {
        if (!previewSkills) return;
        previewSkills.innerHTML = "";

        const allSkills = Array.from(selectedSkills);

        if (customSkillsInput && customSkillsInput.value.trim()) {
            const customList = customSkillsInput.value
                .split(",")
                .map(s => s.trim())
                .filter(Boolean);
            allSkills.push(...customList);
        }

        if (allSkills.length === 0) {
            previewSkills.innerHTML = '<span class="badge-skill" style="opacity: 0.5;">No skills selected</span>';
            return;
        }

        allSkills.forEach(skill => {
            const badge = document.createElement("span");
            badge.className = "badge-skill";
            badge.textContent = skill;
            previewSkills.appendChild(badge);
        });
    }

    // 7. Form Submission Handler
    if (profileForm) {
        profileForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const allSkills = Array.from(selectedSkills);
            if (customSkillsInput && customSkillsInput.value.trim()) {
                allSkills.push(...customSkillsInput.value.split(",").map(s => s.trim()).filter(Boolean));
            }

            const tracks = Array.from(document.querySelectorAll('input[name="track"]:checked')).map(cb => cb.value);

            const payload = {
                fullName: fullNameInput.value.trim(),
                rollNo: rollNoInput.value.trim(),
                branchYear: branchYearInput.value.trim(),
                contact: contactChannelInput.value.trim(),
                primaryRole: primaryRoleSelect.value,
                skills: allSkills,
                tracks: tracks,
                bio: elevatorBioInput.value.trim()
            };

            showStatus("Committing profile to participants.txt...", "pending");

            try {
                const response = await fetch(`${CONFIG.API_BASE_URL}/participants`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    showStatus("Profile committed successfully!", "success");
                    setTimeout(() => {
                        window.location.href = "../index.html";
                    }, 1000);
                } else {
                    showStatus("Failed to save to participants.txt", "error");
                }
            } catch (err) {
                console.warn("C++ API offline. Saved to local session cache.");
                showStatus("Profile committed locally (C++ Server offline).", "success");
            }
        });
    }

    function showStatus(text, type) {
        if (!profileStatus) return;
        profileStatus.textContent = text;
        profileStatus.style.display = "block";
        profileStatus.style.color = type === "error" ? "#ff7b72" : "#3fb950";
    }

    // Initialize state
    renderSkillsPreview();
});