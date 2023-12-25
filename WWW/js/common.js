let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', vh + 'px');
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
});

/*header scroll */
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $(".header").outerHeight();
$(window).scroll(function (event) {
  didScroll = true;
});
setInterval(function () {
  if (didScroll) {
    hasScrolled();
    didScroll = false;
  }
}, 250);
function hasScrolled() {
  var st = $(this).scrollTop();
  if (Math.abs(lastScrollTop - st) <= delta) {
    return;
  }
  if (st > lastScrollTop && st > navbarHeight) {
    // Scroll Down
    $(".header").removeClass("header_down").addClass("header_up");
  } else {
    // Scroll Up
    if (st + $(window).height() < $(document).height()) {
      $(".header").removeClass("header_up").addClass("header_down");
    }
  }
  lastScrollTop = st;
}

/*recent-list*/
document.addEventListener("DOMContentLoaded", function () {
  const recentMoreButton = document.querySelector(".recent-more");
  const recentBox = document.querySelector(".recent-box");

  recentMoreButton.addEventListener("click", function () {
    if (!recentMoreButton.classList.contains("on")) {
      recentMoreButton.classList.add("on");
      recentBox.style.height = "auto";
    } else {
      recentMoreButton.classList.remove("on");
      recentBox.style.height = "0";
    }
  });
});

/*recent-tab*/
$(document).ready(function () {
  $(".recent-nav li").click(function () {
    var idx = $(this).index();
    $(".recent-nav li").removeClass("on");
    $(".recent-nav li").eq(idx).addClass("on");
    $(".recent-con > div").hide();
    $(".recent-con > div").eq(idx).show();
  });
});

/* board-style 선택 코드 */
const label = document.querySelector(".style-label");
const options = document.querySelectorAll(".style-item");
const boardTable = document.querySelector(".board-table");

// 스타일 선택 처리 함수
const handleSelect = (item, index) => {
  const imageSrc = item.querySelector("img").getAttribute("src");
  const labelContent = `<img src="${imageSrc}" alt="선택한 이미지" />`;
  label.innerHTML = labelContent;
  label.parentNode.classList.remove("active");

  options.forEach((opt) => {
    opt.classList.remove("on");
  });

  item.classList.add("on");

  if (index === 1) {
    boardTable.classList.add("on");
  } else {
    boardTable.classList.remove("on");
  }
};

// 각 스타일 옵션에 클릭 이벤트 리스너 추가
options.forEach((option, index) => {
  option.addEventListener("click", () => {
    handleSelect(option, index);
  });
});

// 레이블 클릭으로 옵션 토글
label.addEventListener("click", () => {
  if (label.parentNode.classList.contains("active")) {
    label.parentNode.classList.remove("active");
  } else {
    label.parentNode.classList.add("active");
  }
});

// body 클릭 시 active 클래스 제거
document.body.addEventListener("click", (event) => {
  // 클릭된 엘리먼트가 style-label 또는 그 자식 요소인 경우는 처리하지 않음
  if (!event.target.closest(".style-label")) {
    label.parentNode.classList.remove("active");
  }
});

/*board-style2*/
const label2 = document.querySelector(".style-label2");
const options2 = document.querySelectorAll(".style-item2");
// 클릭한 옵션의 텍스트를 라벨 안에 넣음
const handleSelect2 = function (item) {
  label2.innerHTML = item.textContent;
  label2.parentNode.classList.remove("active");
};
// 옵션 클릭시 클릭한 옵션을 넘김
options2.forEach(function (option) {
  option.addEventListener("click", function () {
    handleSelect2(option);
  });
});
label2.addEventListener("click", function () {
  if (label2.parentNode.classList.contains("active")) {
    label2.parentNode.classList.remove("active");
  } else {
    label2.parentNode.classList.add("active");
  }
});

// body 클릭 시 active 클래스 제거
document.body.addEventListener("click", (event) => {
  // 클릭된 엘리먼트가 style-label 또는 그 자식 요소인 경우는 처리하지 않음
  if (!event.target.closest(".style-label2")) {
    label2.parentNode.classList.remove("active");
  }
});

/*report-btn*/
$(document).on("click", function (event) {
  // 클릭된 요소가 ".more-icon"이면
  if ($(event.target).hasClass("more-icon")) {
    var reportBtn = $(event.target).parent().find(".report-btn");

    // 다른 ".report-btn" 닫기
    $(".report-btn").not(reportBtn).css("display", "none");

    if (reportBtn.length) {
      reportBtn.css("display", "flex");
    }
  } else if (!$(event.target).closest(".report-btn").length) {
    // body를 클릭하면 모든 ".report-btn" 닫기
    $(".report-btn").css("display", "none");
  }
});

$(".report-btn").on("click", function (event) {
  // 이벤트 전파 방지
  event.stopPropagation();

  // 현재 ".report-btn"만 열려 있게 하기
  $(".report-btn").not(this).css("display", "none");
});
