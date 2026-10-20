// frontend/js/teams.js

document.addEventListener("DOMContentLoaded", () => {
    const teamsGrid = document.getElementById("teamsGrid");
    const squadSearchInput = document.getElementById("squadSearchInput");

    let activeSquads = [
        {
            teamName: "AlgoWarriors",
            track: "FinTech / Systems",
            pitch: "Building a high-frequency trading simulator and order matching engine using C++ and sockets.",
            leader: "Kartik Jain",
            currentSize: 2,
            maxCapacity: 4,
            neededRole: "Frontend Specialist",
            requiredStack: ["HTML", "CSS", "JavaScript", "Canvas API"],
            branch: "team-algowarriors"
        },
        {
            teamName: "CyberMesh",
            track: "Web3 & Cloud",
            pitch: "Decentralized identity protocol allowing zero-knowledge proof verification for campus events.",
            leader: "Nandini Gupta",
            currentSize: 3,
            maxCapacity: 4,
            neededRole: "UI/UX & Product Designer",
            requiredStack: ["Figma", "Design Systems", "Tailwind"],
            branch: "team-cybermesh"
        },
        {
            teamName: "VisionPulse",
            track: "AI & Intelligent Systems",
            pitch: "Edge AI traffic violation detection and automatic token generation for college smart gates.",
            leader: "Siddharth Rao",
            currentSize: 2,
            maxCapacity: 4,
            neededRole: "Backend Specialist",
            requiredStack: ["C++", "Python", "Flask", "Docker"],
            branch: "team-visionpulse"
        }
    ];

    async function loadTeams() {
        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/teams`);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    activeSquads = data;
                }
            }
        } catch (e) {
            console.log("Using cached dev squad records.");
        }
        renderTeams(activeSquads);
    }

    function renderTeams(list) {
        if (!teamsGrid) return;
        teamsGrid.innerHTML = "";

        if (list.length === 0) {
            teamsGrid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 40px; font-weight: 600;">No open squads match your search criteria.</p>`;
            return;
        }

        list.forEach(squad => {
            const card = document.createElement("article");
            card.className = "squad-preview-card";
            card.innerHTML = `
                <div>
                    <div class="squad-top">
                        <div>
                            <h3 class="squad-name">${squad.teamName}</h3>
                            <p class="track-tag">🎯 Track: ${squad.track}</p>
                        </div>
                        <span class="capacity-badge">${squad.currentSize}/${squad.maxCapacity} Members</span>
                    </div>

                    <p class="squad-pitch">${squad.pitch}</p>

                    <!-- Roster Lineup -->
                    <div class="squad-roster-box">
                        <span class="box-mini-label">Current Lineup</span>
                        <div class="roster-avatar-row">
                            <span class="roster-chip">👑 ${squad.leader} (Lead)</span>
                            <span class="roster-chip">+${squad.currentSize - 1} Member(s)</span>
                        </div>
                    </div>

                    <!-- Wanted Role Bounty Alert -->
                    <div class="bounty-alert-card">
                        <div class="bounty-header">
                            <span class="bounty-pulse-dot"></span>
                            <span class="bounty-title">Urgently Seeking</span>
                        </div>
                        <h4 class="bounty-role">${squad.neededRole}</h4>
                        <div class="bounty-stack-tags">
                            ${squad.requiredStack.map(tech => `<span class="badge-skill">${tech}</span>`).join("")}
                        </div>
                    </div>
                </div>

                <div class="squad-footer">
                    <span class="card-branch-tag">branch: ${squad.branch || 'team-squad'}</span>
                    <button type="button" class="btn-action" onclick="alert('Merge request submitted to join ${squad.teamName}!')">Request to Merge</button>
                </div>
            `;
            teamsGrid.appendChild(card);
        });
    }

    if (squadSearchInput) {
        squadSearchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            const filtered = activeSquads.filter(s => {
                const inName = s.teamName.toLowerCase().includes(query);
                const inRole = s.neededRole.toLowerCase().includes(query);
                const inTrack = s.track.toLowerCase().includes(query);
                const inStack = s.requiredStack.some(item => item.toLowerCase().includes(query));
                return inName || inRole || inTrack || inStack;
            });
            renderTeams(filtered);
        });
    }

    loadTeams();
});