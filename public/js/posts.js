let currentPage = 1; // 현재 페이지
const postsContainer = document.querySelector(".warp article"); // 게시글을 추가할 컨테이너
const postsPerPage = 5; // 페이지당 표시할 게시글 수
let isFetching = false; // 현재 데이터를 가져오는 중인지 확인

const editPasswordButton = document.getElementById('add_post_button');
editPasswordButton.addEventListener('click', function() {
    window.location.href = '/posting'; 
});


// 게시글을 추가하는 함수
async function loadPosts(page) {
    try {
        if (isFetching) return; // 이미 데이터를 가져오는 중이라면 중단
        isFetching = true;

        const response = await fetch(`http://13.209.17.149/api/posts?page=${page}&limit=${postsPerPage}`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        if (response.status === 400) {
            window.location.href = '/';
            return;
        }

        if (!Array.isArray(data.data.posts)) {
            console.error('데이터가 배열이 아닙니다:', data);
            return;
        }

        // 데이터 렌더링
        data.data.posts.forEach(post => {
            if (post.title.length > 26) {
                post.title = post.title.slice(0, 26) + '...';
            }

            const postElement = document.createElement("div");
            postElement.classList.add("post");
            postElement.onclick = async () => {
                window.location.href = `/posts/${post.post_id}`;
            };
            postElement.innerHTML = `
                <div class="post-header">
                    <div class="post-title">
                        <h3>${post.title}</h3>
                        <div class="post-info">
                            <p>좋아요 ${post.like_cnt} 댓글 ${post.comment_cnt} 조회수 ${post.view_cnt}</p>
                        </div>
                    </div>
                    <div class="post-date">${post.created_at}</div>
                </div>
                <hr />
                <div class="post-footer">
                    <div class="author-info">
                        <div class="author-avatar"></div>
                        <span>작성자 ${post.author.nickname}</span>
                    </div>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });

        isFetching = false; // 데이터 가져오기 완료
    } catch (error) {
        console.error('게시글 로드 오류:', error);
        alert('게시글 로드 중 오류가 발생했습니다.');
        isFetching = false;
    }
}

// 스크롤 이벤트 감지
window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // 스크롤이 하단에 도달했을 때
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        currentPage++;
        loadPosts(currentPage); // 다음 페이지 로드
    }
});

async function fetchActiveUsers() {
    try {
        const response = await fetch(`http://13.209.17.149/api//active-users`, {
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

// 초기 페이지 로드
document.addEventListener("DOMContentLoaded", () => {
    loadPosts(currentPage); // 첫 번째 페이지 로드
    fetchActiveUsers();
});
