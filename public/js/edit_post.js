function toggleDropdown() {
    const dropdown = document.getElementById("dropdown-menu");
    dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
}

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

// 버튼 클릭 시 유효성 검사
submitButton.addEventListener('click', (event) => {
    if (titleInput.value.trim() === '' || contentTextarea.value.trim() === '') {
        event.preventDefault(); // 기본 동작 방지
        helperText.textContent = '*제목, 내용을 모두 작성해주세요';
        helperText.style.display = 'block';
    } else {
        helperText.style.display = 'none';
        window.location.href = 'posts.html';
    }
});
