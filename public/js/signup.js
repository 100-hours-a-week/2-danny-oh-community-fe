import dotenv from 'dotenv';

dotenv.config();

// 이미지 업로드 트리거
function triggerFileInput() {
    const output = document.getElementById('profileImage');
    output.src = "";
    document.querySelector('.overlay').style.display = 'flex';
    document.getElementById('fileInput').click();
    document.getElementById('helper-text-profileImage').style.display = 'flex';
}

// 이미지 미리보기
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            const output = document.getElementById('profileImage');
            output.src = reader.result;
            // 사진이 업로드되면 overlay를 숨김
            document.querySelector('.overlay').style.display = 'none';
            document.getElementById('helper-text-profileImage').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

// 이메일 형식 검사를 위한 정규표현식
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 비밀번호 유효성 검사 정규표현식
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
// 닉네임 유효성 검사 정규표현식
const nicknameRegex = /^[^\s]{1,10}$/;

// 이메일 유효성 검사
const emailInput = document.getElementById('id');
const emailhelperText = document.getElementById('helper-text-email');

emailInput.addEventListener('focusout', function () {
    const email = emailInput.value.trim();
    
    if (!email) {
        emailhelperText.textContent = '*이메일을 입력해주세요.';
        emailhelperText.style.display = 'block';
    } else if (!validateEmail(email)) {
        emailhelperText.textContent = '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
        emailhelperText.style.display = 'block';
    } else {
        // 이메일 중복 체크 서버 연동 필요
        emailhelperText.style.display = 'none';
    }
});

// 비밀번호 유효성 검사
const passInput1 = document.getElementById('pass1');
const pass1helperText = document.getElementById('helper-text-pass1');

passInput1.addEventListener('focusout', function () {
    const password1 = passInput1.value;
    if (!password1) {
        pass1helperText.textContent = '*비밀번호를 입력해주세요.';
        pass1helperText.style.display = 'block';
    } else if (!passwordRegex.test(password1)) {
        pass1helperText.textContent = '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
        pass1helperText.style.display = 'block';
    } else {
        pass1helperText.style.display = 'none';
    }
});

// 비밀번호 확인 검사
const passInput2 = document.getElementById('pass2');
const pass2helperText = document.getElementById('helper-text-pass2');

passInput2.addEventListener('focusout', function () {
    const password1 = passInput1.value;
    const password2 = passInput2.value;
    
    if (!password2) {
        pass2helperText.textContent = '*비밀번호를 한번더 입력해주세요.';
        pass2helperText.style.display = 'block';
    } else if (password1 !== password2) {
        pass2helperText.textContent = '*비밀번호가 다릅니다.';
        pass2helperText.style.display = 'block';
    } else {
        pass2helperText.style.display = 'none';
    }
});

// 닉네임 유효성 검사
const nicknameInput = document.getElementById('nickname');
const nicknamehelperText = document.getElementById('helper-text-nickname');

nicknameInput.addEventListener('focusout', function () {
    const nickname = nicknameInput.value.trim();
    
    if (!nickname) {
        nicknamehelperText.textContent = '*닉네임을 입력해주세요.';
        nicknamehelperText.style.display = 'block';
    } else if (!nicknameRegex.test(nickname)) {
        nicknamehelperText.textContent = '*띄어쓰기를 없애주세요';
        nicknamehelperText.style.display = 'block';
    } else if (nickname.length > 10) {
        nicknamehelperText.textContent = '*닉네임은 최대 10자 까지 작성 가능합니다.';
        nicknamehelperText.style.display = 'block';
    } else {
        // 닉네임 중복 체크 로직 구현 예정
        nicknamehelperText.style.display = 'none';
    }
});

// 입력값에 따라 회원가입 버튼 활성화/비활성화
const submitButton = document.querySelector('.submit-button');

function toggleSubmitButton() {
    const isEmailValid = validateEmail(emailInput.value);
    const isPasswordValid = passwordRegex.test(passInput1.value);
    const isPasswordConfirmed = passInput1.value === passInput2.value;
    const isNicknameValid = nicknameRegex.test(nicknameInput.value);

    if (isEmailValid && isPasswordValid && isPasswordConfirmed && isNicknameValid) {
        submitButton.disabled = false;
        submitButton.style.backgroundColor = '#7F6AEE'; // 활성화 색상
    } else {
        submitButton.disabled = true;
        submitButton.style.backgroundColor = '#ACA0EB'; // 비활성화 색상
    }
}

// 각 input의 input 및 focusout 이벤트에 toggleSubmitButton 연결
emailInput.addEventListener('input', toggleSubmitButton);
passInput1.addEventListener('input', toggleSubmitButton);
passInput2.addEventListener('input', toggleSubmitButton);
nicknameInput.addEventListener('input', toggleSubmitButton);


async function signup() {
    const email = document.getElementById('id').value;
    const password = document.getElementById('pass1').value;
    const profileImage = document.getElementById('fileInput').files[0];
    const nickname = document.getElementById('nickname').value;

    // FormData 객체를 생성하여 데이터를 전송
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('nickname', nickname);
    if (profileImage) {
        formData.append('profileImage', profileImage); 
    }

    try {
        const response = await fetch(`http://${process.env.DB_HOST}/auth/signup`, {
            method: 'POST',
            body: formData,
            credentials: 'include'  // 쿠키 포함
        });
        if (response.status === 201) {
            console.log('회원가입 성공');
            alert('회원가입 성공!');
            window.location.href = '/';
        } else {
            // 클라이언트 요청 에러 (상태 코드 400)
            if (response.status === 400) {
                console.log('이미 존재하는 이메일입니다.');
                alert('이미 존재하는 이메일입니다.');
            }
            else if (response.status === 401) {
                console.log('이미 존재하는 닉네임입니다.');
                alert('이미 존재하는 닉네임입니다.');
            }
            // 서버 내부 오류 (상태 코드 500)
            else if (response.status === 500) {
                console.log(' 서버에 오류가 발생했습니다.');
                alert('서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
        }
    } catch (error) {
        console.error('요청 오류:', error);
        alert('오류가 발생했습니다.');
    }
}



// 회원가입 버튼 클릭 시 로그인 페이지로 이동
submitButton.addEventListener('click', function() {
    signup();
});