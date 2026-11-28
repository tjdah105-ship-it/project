
const categories = document.querySelectorAll(".categories button");
const recommendBtn = document.getElementById("recommendBtn");
const resultText = document.getElementById("resultText");
const canvas = document.getElementById("rouletteCanvas");
const ctx = canvas.getContext("2d");

const menus = {
    "한식": ["김치찌개", "비빔밥", "불고기"],
    "중식": ["짜장면", "짬뽕", "볶음밥"],
    "일식": ["초밥", "라멘", "돈카츠"],
    "양식": ["파스타", "피자", "스테이크"],
    "분식": ["떡볶이", "김밥", "라볶이"]
};

const colors = [
    "#FF6B6B",
    "#FFD93D",
    "#6BCB77",
    "#4D96FF",
    "#9B5DE5",
    "#FF9F1C"
];

let selectedCategory = "상관없음";
let currentRotation = 0;
let isSpinning = false;
let animationFrame = null;

// 메뉴 목록 가져오기
function getMenuList() {
    if (selectedCategory === "상관없음") {
        return Object.values(menus).flat();
    }

    return menus[selectedCategory] || [];
}

// 룰렛 그리기
function drawRoulette() {
    const menuList = getMenuList();

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;

    const sliceAngle = (2 * Math.PI) / menuList.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    menuList.forEach((menu, index) => {
        const startAngle = index * sliceAngle - Math.PI / 2;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(
            centerX,
            centerY,
            radius,
            startAngle,
            endAngle
        );
        ctx.closePath();

        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.stroke();

        // 메뉴 글자 표시
        ctx.save();

        const middleAngle = startAngle + sliceAngle / 2;

        ctx.translate(centerX, centerY);
        ctx.rotate(middleAngle);

        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px Arial, sans-serif";

        ctx.fillText(menu, radius - 25, 0);

        ctx.restore();
    });

    // 중앙 원 장식
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
}

// 회전 각도를 캔버스에 적용
function applyRotation() {
    canvas.style.transform =
        `rotate(${currentRotation}deg)`;
}

// 카테고리 선택
categories.forEach(button => {
    button.addEventListener("click", () => {
        if (isSpinning) return;

        selectedCategory = button.textContent.trim();

        categories.forEach(btn => {
            btn.classList.remove("selected");
        });

        button.classList.add("selected");

        currentRotation = 0;
        applyRotation();
        drawRoulette();

        resultText.textContent =
            `${selectedCategory} 메뉴가 선택되었습니다.`;
    });
});

// 룰렛 회전
function spinRoulette() {
    if (isSpinning) return;

    const menuList = getMenuList();

    if (menuList.length === 0) return;

    isSpinning = true;
    recommendBtn.disabled = true;

    resultText.textContent = "룰렛이 돌아가는 중입니다...";

    const startRotation = currentRotation;

    const sliceAngle = 360 / menuList.length;

    // 무작위 당첨 메뉴 선택
    const winningIndex = Math.floor(
        Math.random() * menuList.length
    );

    // 선택한 메뉴의 중앙이 위쪽 포인터를 향하도록 계산
    const targetAngle =
        360 - (winningIndex + 0.5) * sliceAngle;

    // 최소 5바퀴 이상 회전
    const extraSpins = 360 * 6;

    const normalizedStart =
        ((startRotation % 360) + 360) % 360;

    const rotationDifference =
        (targetAngle - normalizedStart + 360) % 360;

    const finalRotation =
        startRotation + extraSpins + rotationDifference;

    const duration = 4000;
    const startTime = performance.now();

    function animate(now) {
        const elapsed = now - startTime;

        const progress = Math.min(elapsed / duration, 1);

        // 부드럽게 감속하는 효과
        const easedProgress =
            1 - Math.pow(1 - progress, 4);

        currentRotation =
            startRotation +
            (finalRotation - startRotation) * easedProgress;

        applyRotation();

        if (progress < 1) {
            animationFrame =
                requestAnimationFrame(animate);
        } else {
            currentRotation = finalRotation;
            applyRotation();

            resultText.textContent =
                `🎉 오늘의 추천 메뉴는 ${menuList[winningIndex]}입니다!`;

            isSpinning = false;
            recommendBtn.disabled = false;
            animationFrame = null;
        }
    }

    animationFrame = requestAnimationFrame(animate);
}

// 버튼 이벤트
recommendBtn.addEventListener("click", spinRoulette);

// 최초 실행
drawRoulette();
applyRotation();
