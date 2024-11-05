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
function loadPosts(page) {
    fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${postsPerPage}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(post => {
                // 제목이 26자 이상이면 잘라내기
                if (post.title.length > 26) {
                    post.title = post.title.slice(0, 26);
                }
                
                // 게시글 요소 생성
                const postElement = document.createElement("div");
                postElement.classList.add("post");
                postElement.onclick = () => window.location.href = 'detail.html';

                postElement.innerHTML = `
                    <div class="post-header">
                        <div class="post-title">
                            <h3>${post.title}</h3>
                            <div class="post-info">
                                <p>좋아요 0 댓글 0 조회수 0</p>
                            </div>
                        </div>
                        <div class="post-date">2024-01-01 00:00:00</div>
                    </div>
                    <hr />
                    <div class="post-footer">
                        <div class="author-info">
                            <div class="author-avatar"></div>
                            <span>작성자 ${post.userId}</span>
                        </div>
                    </div>
                `;

                postsContainer.appendChild(postElement);
            });

            // 새로운 게시글이 추가된 후 sentinel을 맨 마지막으로 이동
            postsContainer.appendChild(sentinel);
        })
        .catch(error => {
            console.error('Failed to load posts:', error);
        });
}

// 스크롤 감지
const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
        currentPage++;
        loadPosts(currentPage); // 새로운 페이지의 5개 게시글 로드
    }
}, { threshold: 1.0 }); 

// 게시글 초기 로드
loadPosts(currentPage);

// 더미 요소를 추가하여 스크롤 하단 감지
const sentinel = document.createElement("div");
sentinel.id = "sentinel";
postsContainer.appendChild(sentinel);
observer.observe(sentinel);
