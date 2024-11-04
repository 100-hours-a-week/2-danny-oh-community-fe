function toggleDropdown() {
    const dropdown = document.getElementById("dropdown-menu");
    dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
}


const output = document.getElementById('profileImage');
// 이미지 업로드 트리거
function triggerFileInput() {
    output.src = "/images/profile_img.png";
    document.querySelector('.edit-overlay').style.display = 'flex';
    document.getElementById('fileInput').click();
}

// 이미지 미리보기
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            output.src = reader.result;
        };
        reader.readAsDataURL(file);
    }
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

// 닉네임 유효성 검사
const nicknameInput = document.getElementById('nickname');
const submitButton = document.getElementById('submit-button');
const nicknamehelperText = document.getElementById('helper-text-nickname')
const nicknameRegex = /^[^\s]*$/;
submitButton.addEventListener('click', function () {
    const nickname = nicknameInput.value.trim();

    if (!nickname) {
        nicknamehelperText.textContent = '*닉네임을 입력해주세요.';
        nicknamehelperText.style.display = 'block';
    } else if (!nicknameRegex.test(nickname)) {
        nicknamehelperText.textContent = '*띄어쓰기를 없애주세요.';
        nicknamehelperText.style.display = 'block';
    } else if (nickname.length > 10) {
        nicknamehelperText.textContent = '*닉네임은 최대 10자 까지 작성 가능합니다.';
        nicknamehelperText.style.display = 'block';
    } else {
        // 닉네임 중복 체크 로직 구현 예정
        nicknamehelperText.style.display = 'none';
        showToast('수정 완료', () => {
            window.location.href = 'posts.html'; // 토스트가 끝난 후 화면 이동
        });
    }
});


function openQuitModal() {
    document.getElementById("quit-modal").style.display = "block";
}

function closeQuitModal() {
    document.getElementById("quit-modal").style.display = "none";
}

function quit() {
    //회원 탈퇴 절차 진행 예정
    window.location.href = 'login.html';
}