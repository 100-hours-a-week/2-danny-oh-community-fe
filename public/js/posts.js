// 프로필 드롭다운
function toggleDropdown() {
    const dropdown = document.getElementById("dropdown-menu");
    dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
}

//
document.addEventListener("DOMContentLoaded", function () {
    const titles = document.querySelectorAll('.post-title h3');
    
    titles.forEach(title => {
        if (title.textContent.length > 26) {
            title.textContent = title.textContent.slice(0, 26); // 26자 이상이면 잘라내고 '...' 추가
        }
    });
});

document.getElementById('add_post_button').addEventListener('click', function(){
    window.location.href = 'add_post.html'
})


let currentPage = 1; // 현재 페이지
const postsContainer = document.querySelector(".warp article"); // 게시글을 추가할 컨테이너
const postsPerPage = 5; // 페이지당 표시할 게시글 수

// 게시글을 추가하는 함수
function loadPosts() {
    fetch('http://localhost:8000/posts', {
        method: 'GET',
        credentials: 'include', // 쿠키를 포함하여 요청을 보냄
        })// 페이지네이션을 없애고 모든 게시글을 가져옵니다.
        .then(response => response.json())
        .then(data => {
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
                postElement.onclick = () => window.location.href = `detail.html?post_id=${post.post_id}`;  // 상세 페이지로 이동

                postElement.innerHTML = `
                    <div class="post-header">
                        <div class="post-title">
                            <h3>${post.title}</h3>
                            <div class="post-info">
                                <p>좋아요 0 댓글 0 조회수 0</p>
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
        })
        .catch(error => {
            console.error('게시글 로드 오류:', error);
        });
}


// 게시글 초기 로드
loadPosts(currentPage);

// 더미 요소를 추가하여 스크롤 하단 감지
const sentinel = document.createElement("div");
sentinel.id = "sentinel";
postsContainer.appendChild(sentinel);
observer.observe(sentinel);
