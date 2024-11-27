import dotenv from 'dotenv';

dotenv.config();

const output = document.getElementById('profileImage');

let imageFlag = 0;
// 이미지 업로드 트리거
function triggerFileInput() {
    output.src = "/images/profile_img.png";
    document.querySelector('.edit-overlay').style.display = 'flex';
    document.getElementById('fileInput').click();
    imageFlag = 1;
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
        updateUser();
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
        const response = await fetch(`http://13.209.17.149:8000/user`, {
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
        document.getElementById('profileImage').src = data.profileImage ? `http://13.209.17.149:8000${data.profileImage}` : '/images/profile_img.png';
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
        formData.append('profileImage', profileImage); 
    }
    try {
        const response = await fetch('http://13.209.17.149:8000/user', {
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
                alert('이미 존재하는 닉네이입니다.');
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
        const response = await fetch(`http://13.209.17.149:8000/user`, {
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