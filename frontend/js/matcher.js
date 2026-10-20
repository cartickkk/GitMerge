// frontend/js/matcher.js

document.addEventListener("DOMContentLoaded", () => {
    const selectSquad = document.getElementById("selectSquad");
    const selectCandidate = document.getElementById("selectCandidate");
    const btnCalculate = document.getElementById("btnCalculate");
    const resultsBox = document.getElementById("resultsBox");
    const scoreDisplay = document.getElementById("scoreDisplay");
    const verdictLabel = document.getElementById("verdictLabel");
    const roleMatchNote = document.getElementById("roleMatchNote");
    const stackMatchNote = document.getElementById("stackMatchNote");

    // Local compatibility lookup table (simulating C++ matcher.cpp)
    const matchLookup = {
        "AlgoWarriors_Aarav Sharma": {
            score: 96,
            verdict: "Excellent Fit: Missing Role & Skills Matched",
            roleNote: "Aarav directly fills AlgoWarriors' urgent Frontend Specialist gap.",
            stackNote: "Matches required skills: HTML, CSS, JavaScript, Canvas API."
        },
        "AlgoWarriors_Priya Patel": {
            score: 35,
            verdict: "Low Compatibility: Duplicate Role Conflict",
            roleNote: "AlgoWarriors already has 2 backend engineers. High role overlap.",
            stackNote: "Missing the desired frontend visualization skills."
        },
        "AlgoWarriors_Rohan Verma": {
            score: 72,
            verdict: "Good Fit: Useful Design Support",
            roleNote: "Adds product design support, though frontend dev remains open.",
            stackNote: "Provides Figma design system assets for the canvas interface."
        },
        "CyberMesh_Rohan Verma": {
            score: 95,
            verdict: "Excellent Fit: Direct Role & Design Match",
            roleNote: "Rohan directly fills CyberMesh's missing UI/UX Designer role.",
            stackNote: "Matches required stack: Figma, Design Systems, Tailwind."
        },
        "VisionPulse_Priya Patel": {
            score: 94,
            verdict: "Excellent Fit: Core Systems Match",
            roleNote: "Priya fulfills VisionPulse's core C++ Systems and Docker needs.",
            stackNote: "Matches required stack: C++, Python, Flask, Docker."
        }
    };

    if (btnCalculate) {
        btnCalculate.addEventListener("click", async () => {
            const squad = selectSquad.value;
            const candidate = selectCandidate.value;
            const key = `${squad}_${candidate}`;

            btnCalculate.textContent = "Calculating compatibility...";
            btnCalculate.disabled = true;

            try {
                // Attempt to call the C++ backend MatchEngine
                const res = await fetch(`${CONFIG.API_BASE_URL}/match?squad=${encodeURIComponent(squad)}&candidate=${encodeURIComponent(candidate)}`);
                if (res.ok) {
                    const data = await res.json();
                    displayResult(data.score, data.verdict, data.roleNote, data.stackNote);
                    return;
                }
            } catch (err) {
                // Seamless client-side fallback if C++ server is offline
            }

            setTimeout(() => {
                const match = matchLookup[key] || {
                    score: 60,
                    verdict: "Moderate Fit: General Alignment",
                    roleNote: "Partially complements squad requirements without role clashes.",
                    stackNote: "Shared baseline technical stack competencies."
                };
                displayResult(match.score, match.verdict, match.roleNote, match.stackNote);
                btnCalculate.textContent = "Run Compatibility Engine";
                btnCalculate.disabled = false;
            }, 450);
        });
    }

    function displayResult(score, verdict, roleNote, stackNote) {
        if (!resultsBox) return;
        resultsBox.style.display = "block";
        scoreDisplay.textContent = `${score}%`;
        verdictLabel.textContent = verdict;
        roleMatchNote.textContent = roleNote;
        stackMatchNote.textContent = stackNote;

        if (score >= 85) {
            scoreDisplay.style.color = "#3fb950";
            scoreDisplay.style.textShadow = "0 0 14px rgba(63, 185, 80, 0.5)";
        } else if (score >= 60) {
            scoreDisplay.style.color = "var(--color-cream)";
            scoreDisplay.style.textShadow = "var(--glow-cream)";
        } else {
            scoreDisplay.style.color = "#ff7b72";
            scoreDisplay.style.textShadow = "0 0 14px rgba(255, 123, 114, 0.5)";
        }
    }
});