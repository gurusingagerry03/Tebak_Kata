window.onload = function () {
    localStorage.removeItem("kataTarget");
};

if (document.getElementById("currentLevelInfo")) {
    const levelInfo = {
        easy: "Level Easy - 100 poin per kata",
        medium: "Level Medium - 200 poin per kata",
        hard: "Level Hard - 300 poin per kata",
    };
    document.getElementById("currentLevelInfo").textContent =
        levelInfo[selectedLevel];
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
    row.classList.add("row-bar", "d-flex", "fade-in", "pt-1", "pb-2");

    if (maxPerBaris <= 4) {
        row.classList.add("gap-3");
    } else if (maxPerBaris <= 5) {
        row.classList.add("gap-3");
    } else {
        row.classList.add("gap-3");
    }

    for (let i = 0; i < maxPerBaris; i++) {
        const input = document.createElement("input");
        input.className = "letter-input";
        input.setAttribute("maxlength", "1");
        input.setAttribute("type", "text");
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
        const scoreEarned = scorePerLevel[selectedLevel] || 100;
        alert(
            `🎉 BERHASIL! Selamat ${currentUser.userName} anda mendapatkan SCORE ${scoreEarned}`
        );
        currentUser.score += scoreEarned;

        const userIndex = userList.findIndex((u) => u.id === id);
        if (userIndex !== -1) {
            userList[userIndex] = currentUser;
        }

        localStorage.setItem("daftarUser", JSON.stringify(userList));
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
        resultMessage.innerHTML = `Kesempatan habis. Jawabannya: ${targetWord}<br><a href="#" onclick="window.location.reload()" class="try-again-link">Coba Lagi</a>`;
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

function closeGame() {
    window.location.href = "index.html";
    localStorage.removeItem("selectedLevel");
}

const leaderboardLink = document.getElementById("leaderboardLink");
leaderboardLink.href = `leaderboard.html?id=${id}`;
buatBarisBaru();
