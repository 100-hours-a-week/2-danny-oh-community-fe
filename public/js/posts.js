

let currentPage = 1; // 현재 페이지
const postsContainer = document.querySelector(".warp article"); // 게시글을 추가할 컨테이너
const postsPerPage = 10; // 페이지당 표시할 게시글 수
let isFetching = false; // 현재 데이터를 가져오는 중인지 확인

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
                const response = await fetch(`http://13.209.17.149/api/posts/${post.post_id}`, {
                    method: 'post',
                    credentials: 'include',
                });
                if (response.status === 400) {
                    window.location.href = '/';
                    return;
                }
                window.location.href = `/posts/${post.post_id}`;
            };
    
            // 요소 생성 및 텍스트 삽입
            const postHeader = document.createElement("div");
            postHeader.classList.add("post-header");
    
            const postTitle = document.createElement("div");
            postTitle.classList.add("post-title");
    
            const titleElement = document.createElement("h3");
            titleElement.textContent = post.title; // HTML 태그를 텍스트로 표시
    
            const postInfo = document.createElement("div");
            postInfo.classList.add("post-info");
            postInfo.textContent = `좋아요 ${post.like_cnt} 댓글 ${post.comment_cnt} 조회수 ${post.view_cnt}`; // HTML 태그를 무시하고 텍스트로 삽입
    
            const postDate = document.createElement("div");
            postDate.classList.add("post-date");
            postDate.textContent = post.created_at;
    
            postTitle.appendChild(titleElement);
            postTitle.appendChild(postInfo);
            postHeader.appendChild(postTitle);
            postHeader.appendChild(postDate);
    
            const postFooter = document.createElement("div");
            postFooter.classList.add("post-footer");
    
            const authorInfo = document.createElement("div");
            authorInfo.classList.add("author-info");
    
            const authorAvatar = document.createElement("div");
            authorAvatar.classList.add("author-avatar");
    
            const authorName = document.createElement("span");
            authorName.textContent = `작성자 ${post.author.nickname}`; // HTML 태그를 텍스트로 표시
    
            authorInfo.appendChild(authorAvatar);
            authorInfo.appendChild(authorName);
            postFooter.appendChild(authorInfo);
    
            postElement.appendChild(postHeader);
            postElement.appendChild(document.createElement("hr"));
            postElement.appendChild(postFooter);
    
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
        const response = await fetch(`http://13.209.17.149/api/active-users`, {
            method: 'GET',
            credentials: 'include', // 쿠키를 포함하여 요청을 보냄
        });
        
        const users = await response.json();

        // HTML 요소를 가져옵니다.
        const userList = document.getElementById('active-users-list');
        userList.innerHTML = ''; // 기존 리스트 초기화

        // 사용자 데이터 렌더링
        users.forEach(user => {
            const listItem = document.createElement('li');

            // 이미지 URL 처리
            const profileImage = user.profileImage || '/images/default-profile.png';
            const nickname = user.nickname || 'Unknown User';

            // 이미지 요소 생성
            const imgElement = document.createElement('img');
            imgElement.src = profileImage;
            imgElement.alt = "User Profile";

            // 닉네임 텍스트 추가
            const nicknameElement = document.createElement('span');
            nicknameElement.classList.add('nickname');
            nicknameElement.textContent = nickname; // HTML 태그를 텍스트로 표시

            // 리스트 아이템 구성
            listItem.appendChild(imgElement);
            listItem.appendChild(nicknameElement);

            // 리스트에 추가
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
