const titleInput = document.querySelector('input[type="text"]');
const contentTextarea = document.querySelector('textarea');
const submitButton = document.querySelector('.submit-button'); // 단일 요소 선택자로 변경
const helperText = document.querySelector('.helper-text'); // 단일 요소 선택자로 변경
// 초기 상태: 이미지 변경되지 않음
let imageFlag = 0;

// 파일 입력 변경 시 호출되는 함수
function editImage() {
    imageFlag = 1; // 파일이 변경되었음을 표시
}

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

// 버튼 클릭 시 유효성 검사
submitButton.addEventListener('click', (event) => {
    if (titleInput.value.trim() === '' || contentTextarea.value.trim() === '') {
        event.preventDefault(); // 기본 동작 방지
        helperText.textContent = '*제목, 내용을 모두 작성해주세요';
        helperText.style.display = 'block';
    } else {
        helperText.style.display = 'none';
        updatePost();
    }
});

const pathSegments = window.location.pathname.split('/');
const postId = pathSegments[pathSegments.length - 2];

async function loadPosts() {
    try {
        const response = await fetch(`http://13.209.17.149:8000/posts/${postId}`, {
            method: 'GET',
            credentials: 'include', // 쿠키를 포함하여 요청을 보냄
        });

        const data = await response.json();

        if (response.status === 400) {
            alert('로그인이 필요합니다.');
            window.location.href = '/'; 
            return
        } 

        if (response.status === 404) {
            alert('존재하지 않는 글입니다.');
            window.location.href = '/posts'; 
            return
        }
        document.getElementById('title').value = data.data.title
        document.getElementById('content').value = data.data.content

    } catch (error) {
        console.error('게시글 로드 오류:', error);
        alert('게시글 로드 중 오류가 발생했습니다.');
    }
}


async function updatePost() {
    const postImage = document.getElementById('postImage').files[0];
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    // FormData 객체를 생성하여 데이터를 전송
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('imageFlag', imageFlag);
    if (postImage) {
        formData.append('postImage', postImage); 
    }
    console.log(title, content, imageFlag);
    try {
        const response = await fetch(`http://13.209.17.149:8000/posts/${postId}`, {
            method: 'PATCH',
            body: formData,
            credentials: 'include'  // 쿠키 포함
        });

        if (response.status === 204) {
            alert('수정이 완료됐습니다.');
            window.location.href = `/posts/${postId}`;
        } else {
            if (response.status === 400) {
                console.error('잘못된 요청입니다.');
                alert('잘못된 요청입니다.');
            } else if (response.status === 500) {
                console.error('서버에 오류가 발생했습니다.');
                alert('서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
        }
    } catch (error) {
        console.error('요청 오류:', error);
        alert('오류가 발생했습니다.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const postImage = document.getElementById('postImage');
    if (postImage) {
        postImage.addEventListener('click', editImage);
    }
});
loadPosts();

document.getElementById("go_title").addEventListener('click', ()=>{
    window.location.href = '/posts'; 
})