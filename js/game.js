window.onload = function () {
    localStorage.removeItem("kataTarget");
};

const userList = JSON.parse(localStorage.getItem("daftarUser")) || [];
const Params = new URLSearchParams(window.location.search);
const id = parseInt(Params.get("id"));
const currentUser = userList.find((u) => u.id === id);
if (!currentUser) {
      window.location.href = "/index.html";
}

const levelSelect = document.getElementById('levelSelect');
const minimumScores = {
    easy: 0,
    medium: 500,
    hard: 1500
};

const scorePerLevel = {
    easy: 100,
    medium: 200,
    hard: 300
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
    const gameBox = document.querySelector('.game-box');
    const originalDisplay = gameBox.style.display;
    gameBox.style.display = 'none';
    
    const overlay = document.createElement('div');
    overlay.className = 'level-locked-overlay';
    overlay.innerHTML = `
        <div class="level-locked-content">
            <h2>🔒 Level ${level.toUpperCase()} Terkunci</h2>
            <p>Maaf, Anda membutuhkan minimal <strong>${requiredScore}</strong> poin untuk mengakses level ${level.toUpperCase()}.</p>
            <p>Skor Anda saat ini: <strong>${userScore}</strong></p>
            <p>Terus bermain di level yang tersedia untuk mengumpulkan poin!</p>
            <button class="btn-gradient" onclick="closeLevelLockedOverlay()">Kembali Pilih Level</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    overlay.setAttribute('data-original-display', originalDisplay);
}

function closeLevelLockedOverlay() {
    const overlay = document.querySelector('.level-locked-overlay');
    if (overlay) {
        const gameBox = document.querySelector('.game-box');
        const originalDisplay = overlay.getAttribute('data-original-display') || 'block';
        gameBox.style.display = originalDisplay;
        overlay.remove();
        
        if (currentUser.score >= minimumScores.hard) {
            levelSelect.value = 'hard';
        } else if (currentUser.score >= minimumScores.medium) {
            levelSelect.value = 'medium';
        } else {
            levelSelect.value = 'easy';
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
    levelSelect.addEventListener('change', function(e) {
        const selectedLevel = e.target.value;
        
        if (!checkLevelAccess(selectedLevel)) {
            if (currentUser.score >= minimumScores.hard) {
                levelSelect.value = 'hard';
            } else if (currentUser.score >= minimumScores.medium) {
                levelSelect.value = 'medium';
            } else {
                levelSelect.value = 'easy';
            }
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

if (document.getElementById('userScore')) {
    document.getElementById('userScore').textContent = currentUser.score || 0;
}


   let obj = {
    easy: ['kunci', 'rumah', 'bulan', 'pintu', 'mobil'],              // 5 huruf
    medium: ['komputer', 'pensil', 'pelajar', 'kantong', 'tulisan', 'baterai', 'kamera'], // 7 huruf
    hard: ['peralatan', 'kesempatan', 'pengobatan', 'kebakaran', 'pembalasan', 'keberatan', 'perjalanan', 'pemiliknya', 'kesehatan', 'pelayanan'] // 10 huruf
};



let targetWord = localStorage.getItem("kataTarget");
localStorage.setItem("daftarKata", JSON.stringify(obj));

let selectedLevel = localStorage.getItem("selectedLevel") || "easy";

if (levelSelect) {
    levelSelect.value = selectedLevel;
}

if (!checkLevelAccess(selectedLevel, false)) {
    if (currentUser.score >= minimumScores.medium) {
        selectedLevel = 'medium';
    } else {
        selectedLevel = 'easy';
    }
    if (levelSelect) {
        levelSelect.value = selectedLevel;
    }
    localStorage.setItem("selectedLevel", selectedLevel);
}

if (!targetWord) {
    targetWord = getWordByLevel(selectedLevel);
    console.log(`Level: ${selectedLevel}, Kata: ${targetWord}`);
    localStorage.setItem("kataTarget", targetWord);
}

if (document.getElementById('currentLevelInfo')) {
    const levelInfo = {
        easy: "Level Easy - 100 poin per kata",
        medium: "Level Medium - 200 poin per kata",
        hard: "Level Hard - 300 poin per kata"
    };
    document.getElementById('currentLevelInfo').textContent = levelInfo[selectedLevel];
}

const maxKesempatan = 5;
let maxPerBaris = targetWord.length;
let kesempatanSalah = maxKesempatan;
const container = document.getElementById("input-container");
const resultMessage = document.getElementById("result-message");

document.getElementById(
    "namaUser"
).innerText = ` ${currentUser.userName.toUpperCase()}`;

function buatBarisBaru() {
    const row = document.createElement("div");
    row.classList.add("row-bar", "d-flex", "fade-in");
    
    if (maxPerBaris <= 5) {
        row.classList.add("gap-3");
    } else if (maxPerBaris <= 7) {
        row.classList.add("gap-2");
    } else {
        row.classList.add("gap-1");
    }

    for (let i = 0; i < maxPerBaris; i++) {
        const input = document.createElement("input");
        input.className = "letter-input";
        input.setAttribute("maxlength", "1");
        input.setAttribute("type", "text");
        
        if (maxPerBaris > 7) {
            input.style.width = "40px";
            input.style.height = "40px";
            input.style.fontSize = "18px";
        } else if (maxPerBaris > 5) {
            input.style.width = "45px";
            input.style.height = "45px";
            input.style.fontSize = "20px";
        }
        
        row.appendChild(input);
    }
    container.appendChild(row);
    setupAutoFocus();
}

function setupAutoFocus() {
    const inputs = document.querySelectorAll(".letter-input");
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];

        input.addEventListener("input", function (e) {
            const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
            e.target.value = val;
            if (val && i < inputs.length - 1) {
                inputs[i + 1].focus();
            }
        });

        input.addEventListener("keydown", function (e) {
            if (e.key === "Backspace" && input.value === "" && i > 0) {
                inputs[i - 1].focus();
            }
        });
    }
}

function cekTebakan() {
    const rows = container.querySelectorAll(".row-bar");
    const lastRow = rows[rows.length - 1];
    const inputs = lastRow.querySelectorAll("input");
    let guess = "";

    for (let i = 0; i < inputs.length; i++) {
        guess += inputs[i].value;
    }

    if (guess.length < maxPerBaris) {
        resultMessage.innerText = "Lengkapi semua huruf.";
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = "";
        }
        return;
    }

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
    }

    const letterCount = {};
    for (let i = 0; i < targetWord.length; i++) {
        const char = targetWord[i];
        if (letterCount[char] === undefined) {
            letterCount[char] = 0;
        }
        letterCount[char]++;
    }

    const status = [];
    for (let i = 0; i < maxPerBaris; i++) {
        status.push("wrong");
    }

    for (let i = 0; i < maxPerBaris; i++) {
        if (guess[i] === targetWord[i]) {
            status[i] = "correct";
            letterCount[guess[i]]--;
        }
    }

    for (let i = 0; i < maxPerBaris; i++) {
        if (status[i] === "correct") {
            continue;
        }
        if (targetWord.includes(guess[i]) && letterCount[guess[i]] > 0) {
            status[i] = "partial";
            letterCount[guess[i]]--;
        }
    }

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].classList.add(status[i]);
    }

    if (guess === targetWord) {
        // ========== MODIFIKASI SCORE BERDASARKAN LEVEL - MULAI ==========
        const scoreEarned = scorePerLevel[selectedLevel] || 100;
        alert(`🎉 BERHASIL! Selamat ${currentUser.userName} anda mendapatkan SCORE ${scoreEarned}`);
        currentUser.score += scoreEarned;
        
        // Update user di array dengan cara yang benar
        const userIndex = userList.findIndex(u => u.id === id);
        if (userIndex !== -1) {
            userList[userIndex] = currentUser;
        }
        
        localStorage.setItem('daftarUser', JSON.stringify(userList));
        localStorage.removeItem("selectedLevel"); 
        
        resultMessage.innerText = "";
        location.reload();
        return;
    }

    if (kesempatanSalah > 1) {
        resultMessage.innerText = "Jawaban kamu salah!";
        kesempatanSalah--;
        document.getElementById("chance").innerText = ` ${kesempatanSalah}`;

        if (kesempatanSalah > 0) {
            buatBarisBaru();
        }
    } else {
        resultMessage.innerText = `Kesempatan habis. Jawabannya: ${targetWord}`;
        document.getElementById("chance").innerText = ` 0`;
    }
}

function Tebak() {
    cekTebakan();

    setTimeout(() => {
        const rows = document.querySelectorAll(".row-bar");
        const lastRow = rows[rows.length - 1];
        const firstInput = lastRow.querySelector("input:not(:disabled)");
        if (firstInput) firstInput.focus();
    }, 100);

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
    });
}

document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        Tebak();
    }
});

function showGuide() {
    document.getElementById("guideModal").style.display = "flex";
}

function closeGuide() {
    document.getElementById("guideModal").style.display = "none";
}

buatBarisBaru();