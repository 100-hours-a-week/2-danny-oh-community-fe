// 로티 애니메이션 설정
var lottieAni = bodymovin.loadAnimation({
    container: document.getElementById('lottie-pop'),
    path: 'https://assets10.lottiefiles.com/packages/lf20_u4rxwy4z.json',
    renderer: 'svg',
    loop: false,
    autoplay: false,
});

function lotties(){
    const littie = document.getElementById("lottie-pop");
    littie.style.display = 'flex';
    lottieAni.stop(); // 애니메이션 초기화
    lottieAni.play(); // 애니메이션 재생
}

// 이메일 형식 검사를 위한 정규표현식
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 이메일 형식 검사를 위한 정규표현식
function validatePass(pass) {
    // 비밀번호 확인 코드 추가 예정
    return true;
}

function checkEmail() {
    const emailInput = document.getElementById('id');
    const helperText = document.querySelector('.helper-text');
    
    // 입력이 비어 있거나 형식이 올바르지 않은 경우
    if (!emailInput.value || !validateEmail(emailInput.value)) {
        helperText.textContent = '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
        return false;
    }

    return true;
}

function checkPass() {
    const passInput = document.getElementById('pw');
    const helperText = document.querySelector('.helper-text');
    
    // 입력이 비어 있거나 형식이 올바르지 않은 경우
    if (!passInput.value) {
        helperText.textContent = '*비밀번호를 입력해주세요.';
        return false;
    } 
    
    if (!validatePass(passInput.value)){
        helperText.textContent = '*비밀번호가 다릅니다.';
        return false;
    }

    return true;
}


function login() {
    const isValid1 = checkEmail();
    const isValid2 = checkPass();
    if(isValid1 && isValid2){
        document.getElementById('lottie-login').style.backgroundColor = '#7F6AEE';
        lotties();
    }
}

// 애니메이션이 끝나면 페이지 이동
lottieAni.addEventListener('complete', function () {
    window.location.href = 'posts.html';
});

