// 이메일 형식 검사를 위한 정규표현식
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 이메일 입력값 확인
function checkEmail() {
    const emailInput = document.getElementById('id');
    const helperText = document.getElementById('helper-text-email');
    
    if (!emailInput.value || !validateEmail(emailInput.value)) {
        helperText.textContent = '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
        return false;
    }
    return true;
}

// 비밀번호 입력값 확인
function checkPass() {
    const passInput = document.getElementById('pw');
    const helperText = document.getElementById('helper-text-pass');
    
    if (!passInput.value) {
        helperText.textContent = '*비밀번호를 입력해주세요.';
        return false;
    } 

    return true;
}

// 이메일과 비밀번호 입력값에 따라 로그인 버튼 색상 변경
function updateButtonState() {
    const passValid = checkPass();
    const emailValid = checkEmail();
    const loginButton = document.getElementById('lottie-login');  // 로그인 버튼
    if (emailValid && passValid) {
        document.getElementById('helper-text-pass').textContent = '';
        document.getElementById('helper-text-email').textContent = '';
        // 유효한 경우 버튼 활성화 및 색상 변경
        loginButton.style.backgroundColor = '#7F6AEE';  // 원하는 색상
        loginButton.disabled = false;  // 버튼 활성화
    } else {
        // 유효하지 않은 경우 버튼 비활성화 및 색상 변경
        loginButton.style.backgroundColor = '#ACA0EB';  // 비활성화 색상
        loginButton.disabled = true;  // 버튼 비활성화
    }
}

// 이메일 또는 비밀번호 입력값이 변경될 때마다 버튼 상태를 업데이트
document.getElementById('id').addEventListener('input', updateButtonState);
document.getElementById('pw').addEventListener('input', updateButtonState);

// 로그인 요청 함수
async function login() {
    const isValid2 = checkPass();
    const isValid1 = checkEmail();
    if (isValid1 && isValid2) {
        const email = document.getElementById('id').value;
        const password = document.getElementById('pw').value;
        document.querySelector('.helper-text').textContent = '';

        try {
            const response = await fetch(` http://13.209.17.149/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'  // 쿠키 포함
            });

            const responseData = await response.json();

            if (response.status === 200) {
                // 로그인 성공 (상태 코드 200)
                console.log('로그인 성공');
                window.location.href = '/posts';  // 로그인 후 리디렉션
            } else {
                // 클라이언트 요청 에러 (상태 코드 400)
                if (response.status === 400) {
                    console.error('유효하지 않은 요청:', responseData.message);
                    alert('유효하지 않은 요청입니다.');
                }
                // 서버 내부 오류 (상태 코드 500)
                else if (response.status === 500) {
                    console.error('서버 오류:', responseData.message);
                    alert('유효하지 않은 아이디 혹은 비밀번호입니다.');
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


// 엔터 키로 로그인 실행
function handleKeydown(event) {
    if (event.key === 'Enter') {
        login(); // 로그인 함수 호출
    }
}

// 이메일과 비밀번호 입력 필드에 이벤트 리스너 추가
document.getElementById('id').addEventListener('keydown', handleKeydown);
document.getElementById('pw').addEventListener('keydown', handleKeydown);
