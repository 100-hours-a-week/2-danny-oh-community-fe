// 상수 정의
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// 요소 가져오기
const emailInput = document.getElementById('id');
const passInput1 = document.getElementById('pass1');
const passInput2 = document.getElementById('pass2');
const nicknameInput = document.getElementById('nickname');
const profileImageInput = document.getElementById('fileInput');
const submitButton = document.querySelector('.submit-button');

const emailHelperText = document.getElementById('helper-text-email');
const pass1HelperText = document.getElementById('helper-text-pass1');
const pass2HelperText = document.getElementById('helper-text-pass2');
const nicknameHelperText = document.getElementById('helper-text-nickname');

// 정규표현식
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
const nicknameRegex = /^[^\s]{1,10}$/;

// 유효성 검사 함수
function validateEmail(email) {
    if (!email) return '*이메일을 입력해주세요.';
    if (!emailRegex.test(email)) return '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
    return '';
}

function validatePassword(password) {
    if (!password) return '*비밀번호를 입력해주세요.';
    if (!passwordRegex.test(password)) {
        return '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
    }
    return '';
}

function validatePasswordConfirmation(password1, password2) {
    if (!password2) return '*비밀번호를 한번 더 입력해주세요.';
    if (password1 !== password2) return '*비밀번호가 다릅니다.';
    return '';
}

function validateNickname(nickname) {
    if (!nickname) return '*닉네임을 입력해주세요.';
    if (!nicknameRegex.test(nickname)) return '*닉네임은 띄어쓰기 없이 최대 10자까지 가능합니다.';
    return '';
}

function validateProfileImage(file) {
    if (file && file.size > MAX_FILE_SIZE) {
        return `이미지 크기가 5MB를 초과했습니다. (현재 크기: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`;
    }
    return '';
}

// 유효성 검사 핸들러
function handleValidation() {
    const emailError = validateEmail(emailInput.value.trim());
    const passwordError = validatePassword(passInput1.value);
    const passwordConfirmError = validatePasswordConfirmation(passInput1.value, passInput2.value);
    const nicknameError = validateNickname(nicknameInput.value.trim());

    emailHelperText.textContent = emailError;
    emailHelperText.style.display = emailError ? 'block' : 'none';

    pass1HelperText.textContent = passwordError;
    pass1HelperText.style.display = passwordError ? 'block' : 'none';

    pass2HelperText.textContent = passwordConfirmError;
    pass2HelperText.style.display = passwordConfirmError ? 'block' : 'none';

    nicknameHelperText.textContent = nicknameError;
    nicknameHelperText.style.display = nicknameError ? 'block' : 'none';

    const isValid = !emailError && !passwordError && !passwordConfirmError && !nicknameError;
    toggleSubmitButton(isValid);
}

function toggleSubmitButton(isEnabled) {
    submitButton.disabled = !isEnabled;
    submitButton.style.backgroundColor = isEnabled ? '#7F6AEE' : '#ACA0EB';
}

// 이미지 업로드 트리거
function triggerFileInput() {
    const output = document.getElementById('profileImage');
    output.src = ""; // 기존 이미지를 초기화
    document.querySelector('.overlay').style.display = 'flex'; // overlay 보이기
    document.getElementById('fileInput').click(); // 파일 선택 창 열기
    document.getElementById('helper-text-profileImage').style.display = 'flex'; // 도움말 표시
}

// 이미지 미리보기 및 크기 제한
function previewImage(event) {
    const file = event.target.files[0];

    if (file) {
        // 파일 크기 확인
        if (file.size > MAX_FILE_SIZE) {
            alert(`이미지 크기가 5MB를 초과했습니다. (현재 크기: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
            event.target.value = ""; // 파일 입력 초기화
            document.getElementById('profileImage').src = "/images/profile_img.png"; // 기본 이미지 복구
            return;
        }

        // 유효한 크기의 파일인 경우 미리보기
        const reader = new FileReader();
        reader.onload = function () {
            const output = document.getElementById('profileImage');
            output.src = reader.result; // 이미지를 미리보기로 표시
            document.querySelector('.overlay').style.display = 'none'; // overlay 숨기기
            document.getElementById('helper-text-profileImage').style.display = 'none'; // 도움말 숨기기
        };
        reader.readAsDataURL(file); // 파일 내용을 읽음
    }
}
// 회원가입 요청
async function signup() {
    const email = emailInput.value.trim();
    const password = passInput1.value;
    const nickname = nicknameInput.value.trim();
    const profileImage = profileImageInput.files[0];

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('nickname', nickname);
    if (profileImage) formData.append('file', profileImage);

    try {
        const response = await fetch('http://13.209.17.149/api/auth/signup', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (response.status === 201) {
            alert('회원가입 성공!');
            window.location.href = '/';
        } else if (response.status === 400) {
            alert('이미 존재하는 이메일입니다.');
        } else if (response.status === 401) {
            alert('이미 존재하는 닉네임입니다.');
        } else if (response.status === 500) {
            alert('서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    } catch (error) {
        console.error('요청 오류:', error);
        alert('오류가 발생했습니다.');
    }
}

// 이벤트 리스너 등록
emailInput.addEventListener('input', handleValidation);
passInput1.addEventListener('input', handleValidation);
passInput2.addEventListener('input', handleValidation);
nicknameInput.addEventListener('input', handleValidation);
profileImageInput.addEventListener('change', previewImage);

submitButton.addEventListener('click', signup);
