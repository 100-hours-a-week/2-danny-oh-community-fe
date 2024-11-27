import dotenv from 'dotenv';

dotenv.config();

const titleInput = document.querySelector('input[type="text"]');
const contentTextarea = document.querySelector('textarea');
const submitButton = document.querySelector('.submit-button'); // 단일 요소 선택자로 변경
const helperText = document.querySelector('.helper-text'); // 단일 요소 선택자로 변경

// 제목 입력 제한 및 버튼 활성화 함수
titleInput.addEventListener('input', () => {
    if (titleInput.value.length > 26) {
        titleInput.value = titleInput.value.slice(0, 26); // 26자를 초과하지 않도록 자름
    }
    toggleSubmitButton();
});

// 본문 입력 시 버튼 활성화 함수
contentTextarea.addEventListener('input', toggleSubmitButton);

function toggleSubmitButton() {
    if (titleInput.value.trim() !== '' && contentTextarea.value.trim() !== '') {
        submitButton.disabled = false;
        submitButton.style.backgroundColor = '#7F6AEE'; // 활성화 색상
    } else {
        submitButton.disabled = true;
        submitButton.style.backgroundColor = '#ACA0EB'; // 비활성화 색상
    }
}

async function addPost() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const postImages = document.getElementById('postImage').files[0];  // 첫 번째 파일을 가져옵니다.

    // FormData 객체를 생성하여 데이터를 전송
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (postImages) {
        formData.append('postImage', postImages); 
    }

    try {
        const response = await fetch(`http://${process.env.DB_HOST}/posts`, {
            method: 'POST',
            body: formData,
            credentials: 'include'  // 쿠키 포함
        });
        if (response.status === 201) {
            // 게시글 업로드 성공 시
            console.log('게시글 업로드 성공');
            // 업로드 후 posts 페이지로 이동
            window.location.href = '/posts';  // 글 목록 페이지로 이동
        } else {
            // 클라이언트 요청 에러 (상태 코드 400)
            if (response.status === 400) {
                console.log('게시글');
                alert('유효하지 않은 요청입니다.');
            }
            // 서버 내부 오류 (상태 코드 500)
            else if (response.status === 500) {
                console.log(' 성공');
                alert('서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
        }
    } catch (error) {
        console.error('요청 오류:', error);
        alert('오류가 발생했습니다.');
    }
}


// 버튼 클릭 시 유효성 검사
submitButton.addEventListener('click', (event) => {
    if (titleInput.value.trim() === '' || contentTextarea.value.trim() === '') {
        event.preventDefault(); // 기본 동작 방지
        helperText.textContent = '*제목, 내용을 모두 작성해주세요';
        helperText.style.display = 'block';
    } else {
        helperText.style.display = 'none';
        addPost();
    }
});

document.getElementById("go_title").addEventListener('click', ()=>{
    window.location.href = '/posts'; 
})