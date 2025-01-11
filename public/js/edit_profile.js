const output = document.getElementById('profileImage');

let imageFlag = 0;

// 최대 이미지 크기 제한 (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// 이미지 업로드 트리거
function triggerFileInput() {
    output.src = "/images/profile_img.png"; // 기본 프로필 이미지 설정
    document.querySelector('.edit-overlay').style.display = 'flex'; // 오버레이 표시
    document.getElementById('fileInput').click(); // 파일 선택 창 열기
    imageFlag = 1;
}

// 이미지 미리보기 및 검증
function previewImage(event) {
    const file = event.target.files[0];

    if (file) {
        // 파일 크기 확인
        if (file.size > MAX_FILE_SIZE) {
            alert(`이미지 크기가 5MB를 초과했습니다. (현재 크기: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
            event.target.value = ""; // 파일 입력 초기화
            return;
        }
        // 유효한 이미지인 경우 미리보기 설정
        const reader = new FileReader();
        reader.onload = function () {
            output.src = reader.result; // 이미지를 미리보기로 표시
        };
        reader.readAsDataURL(file); // 파일을 읽음
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
const nicknameHelperText = document.getElementById('helper-text-nickname');
const nicknameRegex = /^[^\s]{1,10}$/; // 공백 없는 1~10자

submitButton.addEventListener('click', function () {
    const nickname = nicknameInput.value; // 입력값 가져오기 및 양끝 공백 제거

    if (!nickname) {
        nicknameHelperText.textContent = '*닉네임을 입력해주세요.';
        nicknameHelperText.style.display = 'block';
    } else if (nickname.length > 10) { // 닉네임이 10글자 이상인 경우
        nicknameHelperText.textContent = '*닉네임은 10글자 이하로 입력해주세요.';
        nicknameHelperText.style.display = 'block';
    } else if (!nicknameRegex.test(nickname)) {
        nicknameHelperText.textContent = '*닉네임에 띄어쓰기를 제거해주세요.';
        nicknameHelperText.style.display = 'block';
    } else {
        nicknameHelperText.style.display = 'none'; // 유효성 문제 없음
        updateUser(); // 닉네임 업데이트 함수 호출
    }
});


function openQuitModal() {
    document.getElementById("quit-modal").style.display = "block";
}

function closeQuitModal() {
    document.getElementById("quit-modal").style.display = "none";
}

async function load() {
    try {
        const response = await fetch(`http://13.209.17.149/api/user`, {
            method: 'GET',
            credentials: 'include', // 쿠키를 포함하여 요청을 보냄
        });

        const data = await response.json();

        if (response.status === 400) {
            alert('로그인이 필요합니다.');
            window.location.href = '/'; 
            return
        } 
        document.getElementById('user_email').innerHTML = data.email;
        document.getElementById('profileImage').src = data.profileImage ? `${data.profileImage}` : '/images/profile_img.png';
        document.getElementById('nickname').value = data.nickname;
    } catch (error) {
        console.error('로드 오류:', error);
        alert('오류가 발생했습니다.');
    }
}

async function updateUser() {
    const profileImage = document.getElementById('fileInput').files[0];
    const nickname = document.getElementById('nickname').value;

    // FormData 객체를 생성하여 데이터를 전송
    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('imageFlag', imageFlag);
    console.log(imageFlag);
    if (profileImage) {
        formData.append('file', profileImage); 
    }
    try {
        const response = await fetch('http://13.209.17.149/api/user', {
            method: 'PATCH',
            body: formData,
            credentials: 'include'  // 쿠키 포함
        });

        if (response.status === 204) {
            showToast('수정 완료', () => {
                window.location.href = '/posts'; // 토스트가 끝난 후 화면 이동
            });
        } else {
            if (response.status === 401) {
                console.error('잘못된 요청입니다.');
                alert('이미 존재하는 닉네임입니다.');
            } else if (response.status === 500) {
                console.error('서버에 오류가 발생했습니다.')
                alert('서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
        }
    } catch (error) {
        console.error('요청 오류:', error);
        alert('오류가 발생했습니다.');
    }
}


async function deleteUser() {
    try {
        const response = await fetch(`http://13.209.17.149/api/user`, {
            method: 'DELETE',
            credentials: 'include', // 쿠키를 포함하여 요청을 보냄
        });

        if (response.status === 200) {
            alert('탈퇴되었습니다.');
            window.location.href = '/'; 
            return
        } else if (response.status === 400){
            alert('잘못된 요청입니다.');
        } else if (response.status === 401){
            alert('로그인 된 상태여야 합니다.');
        }

    } catch (error) {
        console.error('로드 오류:', error);
        alert('오류가 발생했습니다.');
    }
}

load();

document.getElementById('delete_user_button').addEventListener('click', deleteUser);

document.getElementById("go_title").addEventListener('click', ()=>{
    window.location.href = '/posts'; 
})