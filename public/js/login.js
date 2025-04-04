// 이메일 형식 검사를 위한 정규표현식
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 이메일 입력값 확인
function checkEmail() {
    const emailInput = document.getElementById('id');
    const helperText = document.getElementById('helper-text-email');
    const emailIcon = emailInput.previousElementSibling; // 이메일 아이콘
    
    if (!emailInput.value) {
        helperText.textContent = '*이메일을 입력해주세요.';
        helperText.classList.add('show');
        emailInput.style.borderColor = '#e74c3c';
        emailIcon.style.color = '#e74c3c';
        return false;
    } else if (!validateEmail(emailInput.value)) {
        helperText.textContent = '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
        helperText.classList.add('show');
        emailInput.style.borderColor = '#e74c3c';
        emailIcon.style.color = '#e74c3c';
        return false;
    } else {
        helperText.textContent = '';
        helperText.classList.remove('show');
        emailInput.style.borderColor = '#7F6AEE';
        emailIcon.style.color = '#7F6AEE';
        return true;
    }
}

// 비밀번호 입력값 확인
function checkPass() {
    const passInput = document.getElementById('pw');
    const helperText = document.getElementById('helper-text-pass');
    const passIcon = passInput.previousElementSibling; // 비밀번호 아이콘
    
    if (!passInput.value) {
        helperText.textContent = '*비밀번호를 입력해주세요.';
        helperText.classList.add('show');
        passInput.style.borderColor = '#e74c3c';
        passIcon.style.color = '#e74c3c';
        return false;
    } else {
        helperText.textContent = '';
        helperText.classList.remove('show');
        passInput.style.borderColor = '#7F6AEE';
        passIcon.style.color = '#7F6AEE';
        return true;
    } 
}

// 이메일과 비밀번호 입력값에 따라 로그인 버튼 색상 변경
function updateButtonState() {
    const emailInput = document.getElementById('id');
    const passInput = document.getElementById('pw');
    const loginButton = document.getElementById('lottie-login');  // 로그인 버튼
    
    // 기본적으로 버튼 비활성화 및 색상 변경
    if (!emailInput.value || !passInput.value) {
        loginButton.style.backgroundColor = '#ACA0EB';
        loginButton.style.cursor = 'not-allowed';
        loginButton.disabled = true;
        return;
    }
    
    const passValid = checkPass();
    const emailValid = checkEmail();
    
    if (emailValid && passValid) {
        // 유효한 경우 버튼 활성화 및 색상 변경
        loginButton.style.backgroundColor = '#7F6AEE';
        loginButton.style.cursor = 'pointer';
        loginButton.disabled = false;
        
        // 입력 필드 테두리 색상 복원
        emailInput.style.borderColor = '#7F6AEE';
        passInput.style.borderColor = '#7F6AEE';
        
        // 아이콘 색상 변경
        emailInput.previousElementSibling.style.color = '#7F6AEE';
        passInput.previousElementSibling.style.color = '#7F6AEE';
    } else {
        // 유효하지 않은 경우 버튼 비활성화 및 색상 변경
        loginButton.style.backgroundColor = '#ACA0EB';
        loginButton.style.cursor = 'not-allowed';
        loginButton.disabled = true;
    }
}

// 입력 필드에 포커스가 있을 때 스타일 변경
function setupInputFocus() {
    const inputs = document.querySelectorAll('.inputBox input');
    
    inputs.forEach(input => {
        const icon = input.previousElementSibling;
        
        // 포커스 시 아이콘 색상 변경
        input.addEventListener('focus', () => {
            icon.style.color = '#7F6AEE';
            input.style.borderColor = '#7F6AEE';
        });
        
        // 포커스 아웃 시 검증
        input.addEventListener('blur', () => {
            if (input.id === 'id') {
                checkEmail();
            } else if (input.id === 'pw') {
                checkPass();
            }
        });
    });
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
        const loginButton = document.getElementById('lottie-login');
        
        // 로그인 버튼 로딩 상태
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로그인 중...';
        loginButton.disabled = true;

        try {
            const response = await fetch(`http://13.209.17.149/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'  // 쿠키 포함
            });

            const responseData = await response.json();

            if (response.status === 200) {
                // 로그인 성공 애니메이션
                loginButton.innerHTML = '<i class="fas fa-check"></i> 성공!';
                loginButton.style.backgroundColor = '#27ae60';
                
                // 잠시 후 리디렉션
                setTimeout(() => {
                    window.location.href = '/posts';  // 로그인 후 리디렉션
                }, 1000);
            } else {
                // 로그인 버튼 원래 상태로
                loginButton.innerHTML = '로그인';
                loginButton.disabled = false;
                
                // 클라이언트 요청 에러 (상태 코드 400)
                if (response.status === 400) {
                    showErrorMessage('유효하지 않은 요청입니다.');
                }
                // 서버 내부 오류 (상태 코드 500)
                else if (response.status === 500) {
                    showErrorMessage('유효하지 않은 아이디 혹은 비밀번호입니다.');
                } else {
                    showErrorMessage(responseData.message || '로그인에 실패했습니다.');
                }
            }
        } catch (error) {
            // 로그인 버튼 원래 상태로
            loginButton.innerHTML = '로그인';
            loginButton.disabled = false;
            
            console.error('로그인 요청 오류:', error);
            showErrorMessage('로그인 중 오류가 발생했습니다.');
        }
    }
}

// 오류 메시지 표시 함수
function showErrorMessage(message) {
    // 로그인 폼에 오류 메시지 컨테이너가 있는지 확인
    let errorContainer = document.querySelector('.error-message-container');
    
    if (!errorContainer) {
        // 없으면 생성
        errorContainer = document.createElement('div');
        errorContainer.className = 'error-message-container';
        
        // 로그인 폼 상단에 삽입
        const loginForm = document.querySelector('.login-form-container');
        loginForm.insertBefore(errorContainer, loginForm.firstChild);
        
        // 닫기 버튼 추가
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.color = '#e74c3c';
        closeButton.style.fontSize = '18px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => errorContainer.remove();
        
        // 메시지와 닫기 버튼을 포함할 div
        const messageContent = document.createElement('div');
        messageContent.style.display = 'flex';
        messageContent.style.alignItems = 'center';
        
        // 아이콘 추가
        const icon = document.createElement('i');
        icon.className = 'fas fa-exclamation-circle';
        icon.style.marginRight = '10px';
        
        messageContent.appendChild(icon);
        messageContent.appendChild(document.createTextNode(message));
        
        errorContainer.appendChild(messageContent);
        errorContainer.appendChild(closeButton);
    } else {
        // 이미 있으면 내용만 업데이트
        const messageContent = errorContainer.querySelector('div');
        messageContent.textContent = message;
        
        // 아이콘 유지
        const icon = document.createElement('i');
        icon.className = 'fas fa-exclamation-circle';
        icon.style.marginRight = '10px';
        messageContent.insertBefore(icon, messageContent.firstChild);
    }
}

// 엔터 키로 로그인 실행
function handleKeydown(event) {
    if (event.key === 'Enter') {
        login(); // 로그인 함수 호출
    }
}

// 초기화 함수
function init() {
    // 입력 필드 포커스 설정
    setupInputFocus();
    
    // 버튼 초기 상태 설정
    updateButtonState();
    
    // 이메일과 비밀번호 입력 필드에 이벤트 리스너 추가
    document.getElementById('id').addEventListener('keydown', handleKeydown);
    document.getElementById('pw').addEventListener('keydown', handleKeydown);
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);
