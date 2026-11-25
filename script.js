
const categories = document.querySelectorAll(".categories button");
const recommendBtn = document.getElementById("recommendBtn");
const resultText = document.getElementById("resultText");

// 임시 테스트용 메뉴 데이터
const menus = {
    "한식": ["김치찌개", "비빔밥", "불고기"],
    "중식": ["짜장면", "짬뽕", "볶음밥"],
    "일식": ["초밥", "라멘", "돈카츠"],
    "양식": ["파스타", "피자", "스테이크"],
    "분식": ["떡볶이", "김밥", "라볶이"]
};

let selectedCategory = "상관없음";

// 음식 종류 선택
categories.forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.textContent.trim();

        categories.forEach(btn => {
            btn.classList.remove("selected");
        });

        button.classList.add("selected");
    });
});

// 메뉴 추천 버튼
recommendBtn.addEventListener("click", () => {
    let menuList;

    if (selectedCategory === "상관없음") {
        menuList = Object.values(menus).flat();
    } else {
        menuList = menus[selectedCategory];
    }

    const randomIndex = Math.floor(Math.random() * menuList.length);
    const recommendedMenu = menuList[randomIndex];

    resultText.textContent = `오늘의 추천 메뉴는 ${recommendedMenu}입니다!`;
});
