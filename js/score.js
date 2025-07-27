const userList = JSON.parse(localStorage.getItem("daftarUser")) || [];
const Params = new URLSearchParams(window.location.search);
const id = parseInt(Params.get("id"));
const currentUser = userList.find((u) => u.id === id);
if (!currentUser) {
    window.location.href = "/index.html";
}

const levelSelect = document.getElementById("levelSelect");
const minimumScores = {
    easy: 0,
    medium: 500,
    hard: 1500,
};

const scorePerLevel = {
    easy: 100,
    medium: 200,
    hard: 300,
};

function checkLevelAccess(level, showOverlay = true) {
    const userScore = currentUser.score || 0;
    const requiredScore = minimumScores[level];

    if (userScore < requiredScore) {
        if (showOverlay) {
            showLevelLockedOverlay(level, requiredScore, userScore);
        }
        return false;
    }
    return true;
}

function showLevelLockedOverlay(level, requiredScore, userScore) {
    const existingOverlay = document.querySelector(".level-locked-overlay");
    if (existingOverlay) {
        existingOverlay.remove();
    }

    const gameBox = document.querySelector(".game-box");
    const originalDisplay = gameBox.style.display;
    gameBox.style.display = "none";

    const overlay = document.createElement("div");
    overlay.className = "level-locked-overlay";
    overlay.innerHTML = `
        <div class="level-locked-content">
            <h2>🔒 Level ${level.toUpperCase()} Terkunci</h2>
            <p>Maaf, Anda membutuhkan minimal <strong>${requiredScore}</strong> poin untuk mengakses level ${level.toUpperCase()}.</p>
            <p>Skor Anda saat ini: <strong>${userScore}</strong></p>
            <p>Terus bermain di level yang tersedia untuk mengumpulkan poin!</p>
        </div>
    `;

    overlay.setAttribute("data-original-display", originalDisplay);
    document.body.appendChild(overlay);
}

function closeLevelLockedOverlay() {
    const overlay = document.querySelector(".level-locked-overlay");
    if (overlay) {
        const gameBox = document.querySelector(".game-box");
        const originalDisplay =
            overlay.getAttribute("data-original-display") || "block";
        gameBox.style.display = originalDisplay;
        overlay.remove();

        if (currentUser.score >= minimumScores.hard) {
            levelSelect.value = "hard";
        } else if (currentUser.score >= minimumScores.medium) {
            levelSelect.value = "medium";
        } else {
            levelSelect.value = "easy";
        }
    }
}

function getWordByLevel(level) {
    const daftarKata = JSON.parse(localStorage.getItem("daftarKata")) || obj;
    const wordList = daftarKata[level];

    if (!wordList || wordList.length === 0) {
        console.error(`Tidak ada kata untuk level ${level}`);
        return null;
    }

    return wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
}

if (levelSelect) {
    levelSelect.value = localStorage.getItem("selectedLevel") || "easy";

    levelSelect.addEventListener("change", function (e) {
        const selectedLevel = e.target.value;

        if (!checkLevelAccess(selectedLevel)) {
            return;
        }
        const newWord = getWordByLevel(selectedLevel);
        if (newWord) {
            localStorage.setItem("kataTarget", newWord);
            localStorage.setItem("selectedLevel", selectedLevel);
            location.reload();
        }
    });
}

if (document.getElementById("userScore")) {
    document.getElementById("userScore").textContent = currentUser.score || 0;
}

let targetWord = localStorage.getItem("kataTarget");
let selectedLevel = localStorage.getItem("selectedLevel");
if (!selectedLevel || !checkLevelAccess(selectedLevel, false)) {
    selectedLevel = "easy";
    localStorage.setItem("selectedLevel", "easy");
}
if (!targetWord) {
    targetWord = getWordByLevel(selectedLevel);
    localStorage.setItem("kataTarget", targetWord);
}
