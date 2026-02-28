let newsList = [];
const menus = document.querySelectorAll(".menus button");
const menuBar = document.querySelector("#menu-bar");
const headlineMenu = document.querySelector("#headline-menu");
const searchInput = document.querySelector("#search-input");
const searchClick = document.querySelector("#search-click");

let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?`,
);

let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

// 반응형 토글
menuBar.addEventListener("click", () => {
  headlineMenu.classList.toggle("open");
  const icon = menuBar.querySelector("i");

  if (headlineMenu.classList.contains("open")) {
    icon.classList.replace("fa-circle-chevron-down", "fa-circle-chevron-up");
  } else {
    icon.classList.replace("fa-circle-chevron-up", "fa-circle-chevron-down");
  }
});

// 뉴스 가져오기
const getNews = async () => {
  try {
    url.searchParams.set("page", page);
    url.searchParams.set("pageSize", pageSize);

    const response = await fetch(url);
    const data = await response.json();

    if (response.status !== 200) {
      throw new Error(data.message);
    }

    if (data.articles.length === 0) {
      throw new Error("No result for this search");
    }

    newsList = data.articles;
    totalResults = data.totalResults;
    render();
    paginationRender();
  } catch (error) {
    errorRender(error.message);
  }
};

// 최신뉴스
const getLatestNews = () => {
  page = 1;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?`,
  );
  getNews();
};

// 카테고리
const getNewsByCategory = (event) => {
  page = 1;

  const category = event.target.textContent.toLowerCase();
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${category}`,
  );

  getNews();
};

menus.forEach((menu) => menu.addEventListener("click", getNewsByCategory));

// 검색
const getNewsByKeyword = () => {
  page = 1;

  const keyword = searchInput.value;

  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}`,
  );

  getNews();
};

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") getNewsByKeyword();
});
searchClick.addEventListener("click", getNewsByKeyword);

// 시간 계산
const timeChange = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diff = (now - past) / 1000;

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;

  return `${Math.floor(diff / 31536000)} years ago`;
};

// 렌더
const render = () => {
  const newsHTML = newsList
    .map(
      (news) => `
    <div class="row news">
      <div class="col-lg-4">
        <img
          class="news-img-size"
          src="${news.urlToImage || "https://via.placeholder.com/300?text=no+image"}"
          onerror="this.src='https://via.placeholder.com/300?text=no+image'"
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
        <div>
          ${news.source.name || "no source"} *
          ${timeChange(news.publishedAt)}
        </div>
      </div>
    </div>`,
    )
    .join("");

  document.querySelector("#news-board").innerHTML = newsHTML;
};

// 에러
const errorRender = (message) => {
  document.querySelector("#news-board").innerHTML = `
    <div class="alert alert-danger">${message}</div>
  `;
};

// 페이지네이션
const paginationRender = () => {
  const totalPages = Math.ceil(totalResults / pageSize);
  const pageGroup = Math.ceil(page / groupSize);

  let lastPage = pageGroup * groupSize;
  if (lastPage > totalPages) lastPage = totalPages;

  const firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

  let paginationHTML = "";

  // << 처음
  if (page > 1) {
    paginationHTML += `
      <li class="page-item" onclick="moveToPage(1)">
        <a class="page-link">&laquo;&laquo;</a>
      </li>`;
  }

  // < 이전
  if (page > 1) {
    paginationHTML += `
      <li class="page-item" onclick="moveToPage(${page - 1})">
        <a class="page-link">&laquo;</a>
      </li>`;
  }

  // 숫자
  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `
      <li class="page-item ${i === page ? "active" : ""}" 
          onclick="moveToPage(${i})">
        <a class="page-link">${i}</a>
      </li>`;
  }

  // > 다음
  if (page < totalPages) {
    paginationHTML += `
      <li class="page-item" onclick="moveToPage(${page + 1})">
        <a class="page-link">&raquo;</a>
      </li>`;
  }

  // >> 마지막
  if (page < totalPages) {
    paginationHTML += `
      <li class="page-item" onclick="moveToPage(${totalPages})">
        <a class="page-link">&raquo;&raquo;</a>
      </li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

// 페이지 이동
const moveToPage = (pageNum) => {
  const totalPages = Math.ceil(totalResults / pageSize);

  if (pageNum < 1 || pageNum > totalPages) return;

  page = pageNum;
  getNews();
};

getLatestNews();

// 1. 버튼들에 클릭이벤트 주기
// 2. 카테고리별 뉴스 가져오기
// 3. 그 뉴스를 보여주기
