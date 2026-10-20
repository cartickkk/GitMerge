// frontend/js/teammates.js

document.addEventListener("DOMContentLoaded", () => {
    // 1. 3D Mouse Parallax on the Hero Orbit Stage (if present)
    const stage = document.getElementById("orbitStage");
    if (stage) {
        window.addEventListener("mousemove", (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 45;
            const y = (window.innerHeight / 2 - e.pageY) / 45;
            stage.style.transform = `perspective(1000px) rotateY(${-x}deg) rotateX(${y}deg)`;
        });

        window.addEventListener("mouseleave", () => {
            stage.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
        });
    }

    // 2. Solo Hackers Directory Feed
    const teammatesGrid = document.getElementById("teammatesGrid");
    const searchInput = document.getElementById("searchInput");

    let soloHackers = [
        {
            name: "Aarav Sharma",
            branch: "CSE, 3rd Year",
            contact: "@aarav_builds",
            role: "Frontend Specialist",
            bio: "Building modular UI dashboards with HTML Canvas and React. Looking for a C++ backend developer.",
            skills: ["React", "HTML/CSS", "Figma", "JavaScript"]
        },
        {
            name: "Priya Patel",
            branch: "IT, 2nd Year",
            contact: "@priya_cpp",
            role: "Backend Specialist",
            bio: "Focused on socket programming, multi-threading, and low-latency API development in C++.",
            skills: ["C++", "Python", "Sockets", "Linux"]
        },
        {
            name: "Rohan Verma",
            branch: "ECE, 3rd Year",
            contact: "@rohan_design",
            role: "UI/UX & Product Designer",
            bio: "Creating high-fidelity Figma design systems and user journey flows for hackathon teams.",
            skills: ["Figma", "UI/UX", "Tailwind", "CSS"]
        }
    ];

    async function loadTeammates() {
        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/participants`);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    soloHackers = data;
                }
            }
        } catch (e) {
            console.log("Using cached dev participant records.");
        }
        renderCards(soloHackers);
    }

    function renderCards(list) {
        if (!teammatesGrid) return;
        teammatesGrid.innerHTML = "";

        if (list.length === 0) {
            teammatesGrid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 40px; font-weight: 600;">No matching developers found.</p>`;
            return;
        }

        list.forEach(hacker => {
            const initials = hacker.name.split(" ").map(w => w[0]).join("").toUpperCase().substring(0, 2);
            
            const card = document.createElement("article");
            card.className = "dev-card";
            card.innerHTML = `
                <div class="card-body-content">
                    <div class="card-top">
                        <div class="avatar-circle">${initials}</div>
                        <span class="status-indicator">● Available</span>
                    </div>

                    <h3 class="card-name">${hacker.name}</h3>
                    <p class="card-meta">${hacker.branch} • ${hacker.contact}</p>
                    <span class="role-pill">${hacker.role}</span>
                    <p class="card-bio">${hacker.bio}</p>

                    <div class="card-skills-cloud">
                        ${hacker.skills.map(s => `<span class="badge-skill">${s}</span>`).join("")}
                    </div>
                </div>

                <div class="card-footer">
                    <span class="card-branch-tag">branch: solo-dev</span>
                    <button type="button" class="btn-action" onclick="alert('Merge request invite dispatched to ${hacker.name}!')">Send Invite</button>
                </div>
            `;
            teammatesGrid.appendChild(card);
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            const filtered = soloHackers.filter(h => {
                const inName = h.name.toLowerCase().includes(query);
                const inRole = h.role.toLowerCase().includes(query);
                const inSkills = h.skills.some(s => s.toLowerCase().includes(query));
                return inName || inRole || inSkills;
            });
            renderCards(filtered);
        });
    }

    loadTeammates();
});