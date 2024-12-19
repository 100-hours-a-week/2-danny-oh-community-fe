

document.addEventListener("DOMContentLoaded", function () {
    const titles = document.querySelectorAll('.post-title h3');
    
    titles.forEach(title => {
        if (title.textContent.length > 26) {
            title.textContent = title.textContent.slice(0, 26); // 26자 이상이면 잘라내고 '...' 추가
        }
    });
});

document.getElementById('add_post_button').addEventListener('click', function(){
    window.location.href = '/posting'
})


let currentPage = 1; // 현재 페이지
const postsContainer = document.querySelector(".warp article"); // 게시글을 추가할 컨테이너
const postsPerPage = 5; // 페이지당 표시할 게시글 수

// 게시글을 추가하는 함수
async function loadPosts() {
    try {
        const response = await fetch(`http://13.209.17.149/api/posts`, {
            method: 'GET',
            credentials: 'include', // 쿠키를 포함하여 요청을 보냄
        });

        const data = await response.json();

        if (response.status === 400) {
            window.location.href = '/'; 
            return
        }

        if (!Array.isArray(data.data.posts)) {
            console.error('데이터가 배열이 아닙니다:', data);
            return;
        }

        data.data.posts.forEach(post => {  // 배열에 접근하여 반복문 실행
            // 제목이 26자 이상이면 잘라내기
            if (post.title.length > 26) {
                post.title = post.title.slice(0, 26) + '...';  // 제목이 길면 '...'을 추가
            }

            // 게시글 요소 생성
            const postElement = document.createElement("div");
            postElement.classList.add("post");
            postElement.onclick = async () => {
                window.location.href = `/posts/${post.post_id}`;  // 상세 페이지로 이동
            }
            postElement.innerHTML = `
                <div class="post-header">
                    <div class="post-title">
                        <h3>${post.title}</h3>
                        <div class="post-info">
                            <p>좋아요 ${post.like_cnt} 댓글 ${post.comment_cnt} 조회수 ${post.view_cnt}</p>
                        </div>
                    </div>
                    <div class="post-date">${post.created_at}</div>  <!-- 서버에서 받아온 날짜 표시 -->
                </div>
                <hr />
                <div class="post-footer">
                    <div class="author-info">
                        <div class="author-avatar"></div>
                        <span>작성자 ${post.author.nickname}</span>  <!-- 작성자의 닉네임 표시 -->
                    </div>
                </div>
            `;

            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error('게시글 로드 오류:', error);
        alert('게시글 로드 중 오류가 발생했습니다.');
    }
}


async function fetchActiveUsers() {
    try {
        const response = await fetch(`http://13.209.17.149/api/active-users`, {
            method: 'GET',
            credentials: 'include', // 쿠키를 포함하여 요청을 보냄
        });
        const users = await response.json();

        // HTML 요소를 가져옵니다.
        const userList = document.getElementById('active-users-list');
        userList.innerHTML = ''; // 기존 리스트 초기화

        users.forEach(user => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <img src="${user.profileImage ? `${user.profileImage}` : '/images/profile_img.png'}" />
                <span class="nickname">${user.nickname}</span>
            `;
            userList.appendChild(listItem);
        });
    } catch (err) {
        console.error('Failed to fetch active users:', err);
    }
}

// 페이지 로드 시 접속자 목록을 로드합니다.
document.addEventListener('DOMContentLoaded', () => {
    fetchActiveUsers();
    loadPosts(currentPage);
});
