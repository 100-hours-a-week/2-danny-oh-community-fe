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

const pathSegments = window.location.pathname.split('/');
const postId = pathSegments[pathSegments.length - 1];


async function loadPosts() {
    try {
        const response = await fetch(`http://localhost:8000/posts/${postId}`, {
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
        document.getElementById('postImage').src = data.data.postImage ? `http://localhost:8000${data.data.postImage}` : ''
        document.getElementById('author_image').src = data.data.author.profileImage ? `http://localhost:8000${data.data.author.profileImage}` : '/images/profile_img.png'
        document.getElementById('title').textContent = `${data.data.title}`
        document.getElementById('content').textContent = `${data.data.content}`
        document.getElementById('like_cnt').innerHTML = `${data.data.like_cnt}<br>좋아요수`;
        document.getElementById('comment_cnt').innerHTML = `${data.data.comment_cnt}<br>댓글수`;
        document.getElementById('view_cnt').innerHTML = `${data.data.view_cnt}<br>조회수`;        
        document.getElementById('author').textContent = `${data.data.author.nickname}`
        document.getElementById('created_at').textContent = `${data.data.created_at}`
        
        // 댓글 정보 렌더링
        const commentsContainer = document.getElementById('warp');

        data.data.comments.forEach(comment => {
            const commentElement = document.createElement("div");
            commentElement.classList.add("comment");

            commentElement.innerHTML = `
                <div class="comment-cover">
                    <div class="comment-header">
                        <div class="writer-profile">
                            <button class="profile">
                                <img width="35px" src="${comment.author.profileImage ? `http://localhost:8000${comment.author.profileImage}` : '/images/profile_img.png'}" />
                            </button>
                            <strong>${comment.author.nickname}</strong>
                        </div>
                        <div class="comment-date">${comment.created_at}</div>
                    </div>
                    <div class="two-buttons">
                        <button class="detail-button">수정</button>
                        <button class="detail-button" onclick="openCommentModal()">삭제</button>
                    </div>
                </div>
                <br />
                <span>${comment.content}</span>
            `;

            commentsContainer.appendChild(commentElement);
        });


    } catch (error) {
        console.error('게시글 로드 오류:', error);
        alert('게시글 로드 중 오류가 발생했습니다.');
    }
}

loadPosts();