function openPostModal() {
    document.getElementById("del-post-modal").style.display = "block";
    document.body.style.overflow = 'hidden'; // 백그라운드 스크롤 방지
}

function closePostModal() {
    document.getElementById("del-post-modal").style.display = "none";
    document.body.style.overflow = 'auto'; // 백그라운드 스크롤 방지
}

function openCommentModal(commentId) {
    document.getElementById("del-comment-modal").style.display = "block";
    document.body.style.overflow = 'hidden'; // 백그라운드 스크롤 방지
    // 모달에 선택한 댓글의 id를 설정
    const deleteCommentButton = document.getElementById('delete_comment_button');
    
    // 삭제 버튼 클릭 시 해당 댓글 ID로 삭제 처리
    deleteCommentButton.onclick = function() {
        deleteComment(commentId);
    };
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
let userId;
let postData;
async function loadPosts() {
    try {
        const response = await fetch(`http://localhost:8000/user`, {
            method: 'GET',
            credentials: 'include', // 쿠키를 포함하여 요청을 보냄
        });

        const userData = await response.json();
        if (response.status === 400) {
            alert('로그인이 필요합니다.');
            window.location.href = '/'; 
            return
        } 
        userId = userData.user_id
    } catch (error) {
        console.error('로드 오류:', error);
        alert('오류가 발생했습니다.');
    }


    try {
        const response = await fetch(`http://localhost:8000/posts/${postId}`, {
            method: 'GET',
            credentials: 'include', // 쿠키를 포함하여 요청을 보냄
        });

        const data = await response.json();
        postData = data.data.author.user_id;

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

        // 게시글 수정/삭제 버튼 처리
        const editDeleteButtons = document.getElementById('edit-delete-buttons');
        if (data.data.author.user_id !== userId) {
            editDeleteButtons.style.display = 'none'; // 버튼 숨기기
        } else {
            editDeleteButtons.style.display = 'flex'; // 버튼 보이기
        }
        
        // 댓글 정보 렌더링
        const commentsContainer = document.getElementById('warp');

        data.data.comments.forEach(comment => {
            const commentElement = document.createElement("div");
            commentElement.classList.add("comment");
            commentElement.id = comment.comment_id;
            // 댓글 작성자 ID와 user_id 비교
            const isAuthor = comment.author.user_id === userId;

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
                    ${isAuthor ? `
                    <div class="two-buttons">
                        <button class="detail-button">수정</button>
                        <button class="detail-button" onclick="openCommentModal(${comment.comment_id})">삭제</button>
                    </div>` : ''}
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


async function editPost() {
    try {
        const response = await fetch(`http://localhost:8000/user`, {
            method: 'GET',
            credentials: 'include', // 쿠키를 포함하여 요청을 보냄
        });

        const data = await response.json();
        if (response.status === 400) {
            alert('로그인이 필요합니다.');
            window.location.href = '/'; 
            return
        } 
        if (data.user_id === postData){
            window.location.href = window.location.href + '/edit';
        } else{
            alert('작성자만 수정 할 수 있습니다.')
            return
        }
    } catch (error) {
        console.error('로드 오류:', error);
        alert('오류가 발생했습니다.');
    }
};

async function deletePost(){
    try {
        const response = await fetch(`http://localhost:8000/posts/${postId}`, {
            method: 'DELETE',
            credentials: 'include', // 쿠키를 포함하여 요청을 보냄
        });
        if (response.status === 200) {
            alert('게시글이 삭제되었습니다.');
            window.location.href = '/posts';
        } else 
        if (response.status === 400) {
            alert('잘못된 요청입니다.');
            closePostModal();
            return
        } 

        if (response.status === 401) {
            alert('로그인이 필요합니다.');
            window.location.href = '/'; 
            return
        }
        if (response.status === 403) {
            alert('작성자만 삭제 할 수 있습니다..');
            closePostModal();
            return
        } 

        if (response.status === 404) {
            alert('존재하지 않는 글입니다.');
            window.location.href = '/posts'; 
            return
        }
    }catch (error) {
        console.error('오류:', error);
        alert('오류가 발생했습니다.');
        closePostModal();
    }
};

async function addComment() {
    const content = document.getElementById('comment-input').value;
    if (!content.trim()) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }
    try {
        const response = await fetch(`http://localhost:8000/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
            credentials: 'include'  // 쿠키 포함
        });

        const responseData = await response.json();

        if (response.status === 201) {
            console.log('댓글 작성 성공');
            location.reload();
            
        } else {
            if (response.status === 400) {
                console.error('유효하지 않은 요청:', responseData.message);
                alert('유효하지 않은 요청입니다.');
            }
            else if (response.status === 401) {
                console.error('오류:', responseData.message);
                alert('로그인이 필요합니다');
            } 
            else if (response.status === 404) {
                console.error('오류:', responseData.message);
                alert('존재하지 않는 게시글입니다.');
            } 
        }
    } catch (error) {
        console.error('오류:', error);
        alert('오류가 발생했습니다.');
    }
};

async function deleteComment(commentId){
    try {
        const response = await fetch(`http://localhost:8000/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            credentials: 'include', // 쿠키를 포함하여 요청을 보냄
        });
        if (response.status === 200) {
            alert('댓글이 삭제되었습니다.');
            window.location.href = `/posts/${postId}`;
        } else 
        if (response.status === 400) {
            alert('잘못된 요청입니다.');
            closePostModal();
            return
        } 

        if (response.status === 401) {
            alert('로그인이 필요합니다.');
            window.location.href = '/'; 
            return
        }
        if (response.status === 403) {
            alert('작성자만 삭제 할 수 있습니다..');
            closePostModal();
            return
        } 

        if (response.status === 404) {
            alert('존재하지 않는 댓글입니다.');
            window.location.href = '/posts'; 
            return
        }
    }catch (error) {
        console.error('오류:', error);
        alert('오류가 발생했습니다.');
        closePostModal();
    }
};


loadPosts();

document.getElementById('delete_post_button').addEventListener('click', deletePost);
document.getElementById('edit_post_button').addEventListener('click', editPost);
document.getElementById('comment-submit').addEventListener('click', addComment);