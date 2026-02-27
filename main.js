let newsList = [];
const menus = document.querySelectorAll(".menus button");
const menuBar = document.querySelector("#menu-bar");
const headlineMenu = document.querySelector("#headline-menu");
const searchInput = document.querySelector("#search-input");
const searchClick = document.querySelector("#search-click");

// 반응형 toggle 버튼
menuBar.addEventListener("click", () => {
  headlineMenu.classList.toggle("open");
  const icon = menuBar.querySelector("i");
  if (headlineMenu.classList.contains("open")) {
    icon.classList.remove("fa-circle-chevron-down");
    icon.classList.add("fa-circle-chevron-up");
  } else {
    icon.classList.remove("fa-circle-chevron-up");
    icon.classList.add("fa-circle-chevron-down");
  }
});

let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?`,
);

// url 응답 데이터 화면표시
const getNews = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      render();
    } else {
      throw new Error(data.message);
    }
    newsList = data.articles;
    render();
  } catch (error) {
    console.log(error.message);
    errorRender(error.message);
  }
};

menus.forEach((menu) => {
  menu.addEventListener("click", (event) => getNewsByCategory(event));
});

const getLatestNews = () => {
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?`,
  );
  getNews();
};

// 카테고리 검색
const getNewsByCategory = (event) => {
  const category = event.target.textContent.toLowerCase();
  console.log(category);
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${category}`,
  );
  getNews();
};

// 검색어 검색
const getNewsByKeyword = () => {
  const keyword = document.querySelector("#search-input").value;

  console.log(keyword);
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}`,
  );
  getNews();
};
// 검색 엔터키 이벤트
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getNewsByKeyword();
  }
});
// 검색 클릭 이벤트
searchClick.addEventListener("click", getNewsByKeyword);

// 현재 시간으로부터 view에 보이는 뉴스가 얼마나 지났는지 확인하는 함수
const timeChange = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diff = (now - past) / 1000;

  if (diff < 60) return "just now";

  const minutes = diff / 60;
  if (minutes < 60) return `${Math.floor(minutes)} minutes ago`;

  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)} hours ago`;

  const days = hours / 24;
  if (days < 30) return `${Math.floor(days)} days ago`;

  const months = days / 30;
  if (months < 12) return `${Math.floor(months)} months ago`;

  const years = months / 12;
  return `${Math.floor(years)} years ago`;
};

// 렌더링 함수
const render = () => {
  const newsHTML = newsList.map(
    (news) => `
    <div class="row news">
          <div class="col-lg-4">
            <img
             class="news-img-size"
             src="${news.urlToImage || "https://via.placeholder.com/300?text=no+image"}"
             onerror="this.src='https://via.placeholder.com/300?text=no+image'"
             style="opacity:0"
             onload="this.style.opacity=1"
            />
          </div>
          <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>
              ${
                news.description && news.description.length > 200
                  ? news.description.slice(0, 200) + "..."
                  : news.description || ""
              }
            </p>
            <div>${news.source.name || "no source"} * ${timeChange(news.publishedAt)}</div>
          </div>
        </div>`,
  );
  document.querySelector("#news-board").innerHTML = newsHTML.join("");
};

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
  A simple danger alert—check it out!
  ${errorMessage}
  </div>`;

  document.querySelector("#news-board").innerHTML = errorHTML;
};
getLatestNews();

// 1. 버튼들에 클릭이벤트 주기
// 2. 카테고리별 뉴스 가져오기
// 3. 그 뉴스를 보여주기
