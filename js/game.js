window.onload = function () {
    localStorage.removeItem("kataTarget");
};

let targetWord = localStorage.getItem("kataTarget");

if (!targetWord) {
    const daftarKata = JSON.parse(localStorage.getItem("daftarKata")) || [
        "LAPAR",
    ];
    targetWord =
        daftarKata[Math.floor(Math.random() * daftarKata.length)].toUpperCase();
    localStorage.setItem("kataTarget", targetWord);
}

const userList = JSON.parse(localStorage.getItem("daftarUser")) || [];
const Params = new URLSearchParams(window.location.search);
const id = parseInt(Params.get("id"));
const currentUser = userList.find((u) => u.id === id);

const maxKesempatan = 5;
const maxPerBaris = targetWord.length;
let kesempatanSalah = maxKesempatan;
const container = document.getElementById("input-container");
const resultMessage = document.getElementById("result-message");

document.getElementById(
    "namaUser"
).innerText = ` ${currentUser.userName.toUpperCase()}`;

function buatBarisBaru() {
    const row = document.createElement("div");
    row.classList.add("row-bar", "d-flex", "gap-3", "fade-in");

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
        alert("🎉 BERHASIL!");
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
