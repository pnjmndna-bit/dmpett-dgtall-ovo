document.addEventListener(
'gesturestart',
function(e){
    e.preventDefault();
}
);

/* ===================== */
/* POSTER SLIDER */
/* AUTO + SWIPE + BUTTON */
/* ===================== */

const slides =
document.querySelectorAll(
".banner-slide"
);

const dots =
document.querySelectorAll(
".dot"
);

const prevBtn =
document.querySelector(
".prev"
);

const nextBtn =
document.querySelector(
".next"
);

let currentSlide = 0;
let startX = 0;
let endX = 0;

/* tampil slide */
function showSlide(index){

    slides.forEach(slide=>{

        slide.classList.remove(
        "active"
        );

    });

    dots.forEach(dot=>{

        dot.classList.remove(
        "active"
        );

    });

    slides[index]
    .classList.add(
    "active"
    );

    if(dots[index]){

        dots[index]
        .classList.add(
        "active"
        );

    }

}

/* ===================== */
/* AUTO SLIDE */
/* ===================== */

if(slides.length > 0){

    setInterval(()=>{

        currentSlide++;

        if(
        currentSlide >=
        slides.length
        ){
            currentSlide = 0;
        }

        showSlide(
        currentSlide
        );

    },2500);

}

/* ===================== */
/* TOMBOL NEXT */
/* ===================== */

if(nextBtn){

    nextBtn.addEventListener(
    "click",
    ()=>{

        currentSlide++;

        if(
        currentSlide >=
        slides.length
        ){
            currentSlide = 0;
        }

        showSlide(
        currentSlide
        );

    }
    );

}

/* ===================== */
/* TOMBOL PREV */
/* ===================== */

if(prevBtn){

    prevBtn.addEventListener(
    "click",
    ()=>{

        currentSlide--;

        if(
        currentSlide < 0
        ){
            currentSlide =
            slides.length - 1;
        }

        showSlide(
        currentSlide
        );

    }
    );

}

/* ===================== */
/* KLIK TITIK */
/* ===================== */

dots.forEach(
(dot,index)=>{

    dot.addEventListener(
    "click",
    ()=>{

        currentSlide =
        index;

        showSlide(
        currentSlide
        );

    }
    );

});

/* ===================== */
/* SWIPE */
/* ===================== */

const bannerBox =
document.querySelector(
".banner-box"
);

if(bannerBox){

    bannerBox.addEventListener(
    "touchstart",
    (e)=>{

        startX =
        e.touches[0]
        .clientX;

    }
    );

    bannerBox.addEventListener(
    "touchend",
    (e)=>{

        endX =
        e.changedTouches[0]
        .clientX;

        let distance =
        startX - endX;

        /* geser kiri */
        if(distance > 50){

            currentSlide++;

            if(
            currentSlide >=
            slides.length
            ){
                currentSlide = 0;
            }

            showSlide(
            currentSlide
            );

        }

        /* geser kanan */
        if(distance < -50){

            currentSlide--;

            if(
            currentSlide < 0
            ){
                currentSlide =
                slides.length - 1;
            }

            showSlide(
            currentSlide
            );

        }

    }
    );

}

/* ========================= */
/* RESET LOADING SAAT BACK */
/* ========================= */

window.addEventListener(
"pageshow",
()=>{

    const loadingBox =
    document.getElementById(
    "loadingBox"
    );

    if(loadingBox){

        loadingBox.style.display =
        "none";

    }

}
);

function updateWIB(){

    const now = new Date();

    const jam =
    now.getHours()
    .toString()
    .padStart(2,"0");

    const menit =
    now.getMinutes()
    .toString()
    .padStart(2,"0");

    const timeBox =
    document.getElementById(
    "timeBox"
    );

    if(timeBox){

        timeBox.innerText =
        `${jam}:${menit}`;

    }

}

updateWIB();

setInterval(
updateWIB,
1000
);

const marqueeText =
document.getElementById("marqueeText");

function randomPhone(){

    const prefix = [
        "0812","0813","0821","0822",
        "0852","0853","0877","0878"
    ];

    const awal =
    prefix[Math.floor(Math.random() * prefix.length)];

    const akhir =
    Math.floor(1000 + Math.random() * 9000);

    return `${awal}***${akhir}`;
}

const aktivitas = [
    "Telah Berhasil Verifikasi Akun",
    "Telah Mengaktifkan OVO Asuransi",
    "Telah Mencairkan Pinjaman",
    "Telah Memperoleh OVO Hadiah",
    "Telah Mengaktifkan OVO PayLater"
];

function updateMarquee(){

    const nomor = randomPhone();

    const teks =
    aktivitas[Math.floor(Math.random() * aktivitas.length)];

    marqueeText.innerText =
    `🔔 ${nomor} ${teks}`;

    marqueeText.classList.remove("run");

    void marqueeText.offsetWidth;

    marqueeText.classList.add("run");
}

updateMarquee();

marqueeText.addEventListener("animationiteration", () => {
    updateMarquee();
});

/* ===================== */
/* MENU CLICK */
/* ===================== */

const menuBox =
document.querySelectorAll(
".menu-box"
);

menuBox.forEach((box)=>{

    box.addEventListener(
    "click",
    ()=>{

        /* efek sentuh */
        box.style.transform =
        "scale(0.96)";

        box.style.filter =
        "brightness(0.9)";

        setTimeout(()=>{

            box.style.transform =
            "scale(1)";

            box.style.filter =
            "brightness(1)";

        },150);

        /* tampil loading */
        const loadingBox =
        document.getElementById(
        "loadingBox"
        );

        loadingBox.style.display =
        "flex";

        /* pindah halaman */
        setTimeout(()=>{

            window.location.href =
            "loading.html";

        },2000);

    }
    );

});
