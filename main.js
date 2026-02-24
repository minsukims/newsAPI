let newsList = [];
const getLatestNews = async () => {
  const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/`);
  console.log("uuu", url);
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;

  console.log("dddd", newsList);
  render();
};
const render = () => {
  let newsHTML = ``;
  newsHTML = newsList.map(
    (news) => `
    <div class="row news">
          <div class="col-lg-4">
            <img
              class="news-img-size"
             src=${news.urlToImage}
            />
          </div>
          <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>
              ${news.description}
            </p>
            <div>${news.source.name} * ${news.publishedAt}</div>
          </div>
        </div>`,
  );
  document.querySelector("#news-board").innerHTML = newsHTML.join("");
};
getLatestNews();
