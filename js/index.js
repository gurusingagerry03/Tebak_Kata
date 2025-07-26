let user = JSON.parse(localStorage.getItem("daftarUser")) || [];

function createUser() {
    const input = document.getElementById("username");

    let id = 1;
    if (user.length !== 0) {
        id = user[user.length - 1].id + 1;
    }

    let obj = {
        id,
        userName: input.value,
        score: 0,
    };

    if (input.value !== "") {
        for (let i = 0; i < user.length; i++) {
            if (user[i].userName.toUpperCase() === input.value.toUpperCase()) {
                window.location.href = `game.html?id=${user[i].id}`;
                return;
            }
        }

        user.push(obj);
        localStorage.setItem("daftarUser", JSON.stringify(user));
        window.location.href = `game.html?id=${id}`;
    }
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    createUser();
});
