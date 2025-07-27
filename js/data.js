if (!localStorage.getItem("daftarUser")) {
    const dummyUser = [
        { id: 1, userName: "raihan_01", score: 4832 },
        { id: 2, userName: "dewi_anggi", score: 2517 },
        { id: 3, userName: "putra007", score: 3620 },
        { id: 4, userName: "lisa_nur", score: 1785 },
        { id: 5, userName: "alvin_gaming", score: 4012 },
        { id: 6, userName: "cintya22", score: 2391 },
        { id: 7, userName: "dimas_dev", score: 3256 },
        { id: 8, userName: "nadiaart", score: 1127 },
        { id: 9, userName: "bima_xyz", score: 2874 },
        { id: 10, userName: "yulia_cek", score: 4959 },
    ];
    localStorage.setItem("daftarUser", JSON.stringify(dummyUser));
}

if (!localStorage.getItem("daftarKata")) {
    const daftarKata = {
        easy: [
            "BOLA",
            "TALI",
            "KACA",
            "SAPI",
            "JARI",
            "BESI",
            "KATA",
            "LUKA",
            "ROTI",
            "HATI",
        ],
        medium: [
            "LAPAR",
            "LAMPU",
            "HUJAN",
            "MOTOR",
            "TEMAN",
            "BESAR",
            "KUNCI",
            "SALJU",
            "KABUR",
            "MINUM",
        ],
        hard: [
            "KANTOR",
            "LAPTOP",
            "MUSEUM",
            "JARING",
            "MENTOR",
            "KARPET",
            "SEPEDA",
            "KAMERA",
            "RUMPUT",
        ],
    };
    localStorage.setItem("daftarKata", JSON.stringify(daftarKata));
}
