let newsList = [];
const menus = document.querySelectorAll(".menus button");
const menuBar = document.querySelector("#menu-bar");
const headlineMenu = document.querySelector("#headline-menu");
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

menus.forEach((menu) => {
  menu.addEventListener("click", (event) => getNewsByCategory(event));
});

console.log("mmm", menus);
const getLatestNews = async () => {
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?`,
  );
  console.log("uuu", url);
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;

  console.log("dddd", newsList);
  render();
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  console.log(category);
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${category}`,
  );
  const response = await fetch(url);
  const data = await response.json();
  console.log("Ddd", data);
  newsList = data.articles;
  render();
};

const getNewsByKeyword = async () => {
  const keyword = document.querySelector("#search-input").value;

  console.log(keyword);
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}`,
  );
  const response = await fetch(url);
  const data = await response.json();
  console.log("Qqq", data);
  newsList = data.articles;
  render();
};

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
getLatestNews();

// 1. 버튼들에 클릭이벤트 주기
// 2. 카테고리별 뉴스 가져오기
// 3. 그 뉴스를 보여주기
