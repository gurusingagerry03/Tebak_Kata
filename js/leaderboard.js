const Params = new URLSearchParams(window.location.search);
const id = parseInt(Params.get("id"));

const backToGame = document.getElementById("backToGame");
backToGame.href = `game.html?id=${id}`;

const user = JSON.parse(localStorage.getItem("daftarUser"));

function readData() {
    let template = "";

    const sortedUsers = user.sort(function (a, b) {
        return b.score - a.score;
    });

    for (let i = 0; i < sortedUsers.length; i++) {
        const perObj = sortedUsers[i];

        if (i >= 5) {
            if (sortedUsers[i].id === id) {
                template += `<tr class="highlight-user">
                <td>${i + 1}</td>
                <td>${perObj.userName.toUpperCase()}</td>
                <td>${perObj.score}</td>
            </tr>`;
            }
        } else {
            const isCurrent = perObj.id === id;
            const rowClass = isCurrent ? "highlight-user" : "";

            template += `<tr class="${rowClass}">
                    <td>${i + 1}</td>
                    <td>${perObj.userName.toUpperCase()}</td>
                    <td>${perObj.score}</td>
                </tr>`;
        }
    }

    document.getElementById("leaderBoard-list").innerHTML = template;
}

function resetScore() {
    const userData = JSON.parse(localStorage.getItem("daftarUser")) || [];

    const filteredUser = userData.filter(function (perObj) {
        return perObj.id !== id;
    });

    localStorage.setItem("daftarUser", JSON.stringify(filteredUser));

    window.location.href = "index.html";
}

readData();
