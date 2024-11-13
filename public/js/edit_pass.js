function toggleDropdown() {
    const dropdown = document.getElementById("dropdown-menu");
    dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
}

function showToast(message, callback) {
    const toast = document.getElementById('toast');
    toast.textContent = message; // 토스트 메시지를 동적으로 설정
    toast.className = 'toast show';
    
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
        if (callback) {
            callback(); // 콜백 함수 호출
        }
    }, 1000); // 2초 후에 토스트 숨김
}

// 비밀번호 유효성 검사
const passInput1 = document.getElementById('pass1');
const pass1helperText = document.getElementById('helper-text-pass1');
// 비밀번호 유효성 검사 정규표현식
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

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


// 입력값에 따라 회원가입 버튼 활성화/비활성화
const submitButton = document.getElementById('submit-button');

function toggleSubmitButton() {
    const isPasswordValid = passwordRegex.test(passInput1.value);
    const isPasswordConfirmed = passInput1.value === passInput2.value;

    if (isPasswordValid && isPasswordConfirmed) {
        submitButton.disabled = false;
        submitButton.style.backgroundColor = '#7F6AEE'; // 활성화 색상
    } else {
        submitButton.disabled = true;
        submitButton.style.backgroundColor = '#ACA0EB'; // 비활성화 색상
    }
}

// 각 input의 input 및 focusout 이벤트에 toggleSubmitButton 연결
passInput1.addEventListener('input', toggleSubmitButton);
passInput2.addEventListener('input', toggleSubmitButton);

// 회원가입 버튼 클릭 시 로그인 페이지로 이동
submitButton.addEventListener('click', function() {
    showToast('수정 완료', () => {
        window.location.href = 'posts.html'; // 토스트가 끝난 후 화면 이동
    });
});
ㅁ