function toggleDropdown() {
    const dropdown = document.getElementById("dropdown-menu");
    dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
}
function openPostModal() {
    document.getElementById("del-post-modal").style.display = "block";
    document.body.style.overflow = 'hidden'; // 백그라운드 스크롤 방지
}

function closePostModal() {
    document.getElementById("del-post-modal").style.display = "none";
    document.body.style.overflow = 'auto'; // 백그라운드 스크롤 방지
}

function openCommentModal() {
    document.getElementById("del-comment-modal").style.display = "block";
    document.body.style.overflow = 'hidden'; // 백그라운드 스크롤 방지
}

function closeCommentModal() {
    document.getElementById("del-comment-modal").style.display = "none";
    document.body.style.overflow = 'auto'; // 백그라운드 스크롤 방지
}

document.getElementById('comment-input').addEventListener('input', function(){
    const commentInput = document.getElementById('comment-input');
    const submitButton = document.getElementById('comment-submit');

    if (commentInput.value.trim() !== '') {
        submitButton.disabled = false;
        submitButton.style.backgroundColor = '#7F6AEE'; // 활성화 시 색상
    } else {
        submitButton.disabled = true;
        submitButton.style.backgroundColor = '#ACA0EB'; // 비활성화 시 색상
    }
})