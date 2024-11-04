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
