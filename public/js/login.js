// 로티 애니메이션 설정
var lottieAni = bodymovin.loadAnimation({
    container: document.getElementById('lottie-pop'),
    path: 'https://assets10.lottiefiles.com/packages/lf20_u4rxwy4z.json',
    renderer: 'svg',
    loop: false,
    autoplay: false,
});

function lotties(){
    const lottie = document.getElementById("lottie-pop");
    lottie.style.display = 'flex';
    lottieAni.stop(); // 애니메이션 초기화
    lottieAni.play(); // 애니메이션 재생
}

// 이메일 형식 검사를 위한 정규표현식
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 비밀번호 형식 검사를 위한 정규표현식
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

async function login() {
    const isValid1 = checkEmail();
    const isValid2 = checkPass();
    if (isValid1 && isValid2) {
        document.getElementById('lottie-login').style.backgroundColor = '#7F6AEE';

        const email = document.getElementById('id').value;
        const password = document.getElementById('pw').value;
        document.querySelector('.helper-text').textContent = '';

        try {
            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'  // 쿠키 포함
            });

            const responseData = await response.json();

            if (response.ok) {
                // 로그인 성공 (상태 코드 200)
                console.log('로그인 성공');
                // 애니메이션이 완료된 후 페이지 이동
                lotties();
            } else {
                // 클라이언트 요청 에러 (상태 코드 400)
                if (response.status === 400 && responseData.message === "invalid_request") {
                    console.error('유효하지 않은 요청:', responseData.message);
                    alert('유효하지 않은 요청입니다.');
                }
                // 서버 내부 오류 (상태 코드 500)
                else if (response.status === 500 && responseData.message === "internal_server_error") {
                    console.error('서버 오류:', responseData.message);
                    alert('서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                } else {
                    console.error('알 수 없는 에러:', responseData.message);
                    alert(responseData.message || '로그인에 실패했습니다.');
                }
            }
        } catch (error) {
            console.error('로그인 요청 오류:', error);
            alert('로그인 중 오류가 발생했습니다.');
        }
    }
}

lottieAni.addEventListener('complete', function () {
    window.location.href = '/posts';
});