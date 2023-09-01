import {dataJson} from "./json.js";

const articlesPerPage = 16;
let currentPage = 1;

const searchInJsonData = (query) => {
  return dataJson.articles.filter((article) =>
    article.title && query &&
    article.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);
};

const header = document.createElement("header");
header.classList.add("header");

const container = document.createElement("div");
container.classList.add("container", "header__container");

const logoContainer = document.createElement("div");
logoContainer.classList.add("header__logo");

const logoImg = document.createElement("img");
logoImg.src = "styles/img-global/logo.svg";
logoImg.alt = "Logo";

const searchRegionContainer = document.createElement("div");
searchRegionContainer.classList.add("header__search-region");

const searchInputLabel = document.createElement("label");
searchInputLabel.setAttribute("for", "searchInput");
searchInputLabel.classList.add("header__label");

const searchInputContainer = document.createElement("div");
searchInputContainer.classList.add("header__search-input-container");

const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.id = "searchInput";
searchInput.classList.add("header__search");
searchInput.placeholder = "I'm searching...";

searchInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    const query = searchInput.value;
    if (query) {
      const searchResults = searchInJsonData(query);
      displaySearchResults(searchResults);
    }
  }
});

const searchSubmitButton = document.createElement("button");
searchSubmitButton.type = "submit";
searchSubmitButton.classList.add("header__search-submit");

const regionInputLabel = document.createElement("label");
regionInputLabel.setAttribute("for", "regionSelect");
regionInputLabel.classList.add("header__label");

const regionSelect = document.createElement("select");
regionSelect.id = "regionSelect";
regionSelect.classList.add("header__region");

const countries = [{ code: 'us', name: 'USA' }];

countries.forEach(country => {
  const option = document.createElement("option");
  option.value = country.code;
  option.textContent = country.name;
  regionSelect.appendChild(option);
});

searchSubmitButton.addEventListener('click', () => {
  const query = searchInput.value;
  if (query) {
    const searchResults = searchInJsonData(query);
    displaySearchResults(searchResults);
  }
});

searchInputContainer.appendChild(searchInput);
searchInputContainer.appendChild(searchSubmitButton);

logoContainer.appendChild(logoImg);
searchRegionContainer.appendChild(searchInputLabel);
searchRegionContainer.appendChild(searchInputContainer);
searchRegionContainer.appendChild(regionInputLabel);
searchRegionContainer.appendChild(regionSelect);

container.appendChild(logoContainer);
container.appendChild(searchRegionContainer);
header.appendChild(container);

document.body.appendChild(header);

const main = document.createElement("main");
main.classList.add("main");

const mainContainer = document.createElement("div");
mainContainer.classList.add("container", "main__container");

const searchResultsTitle = document.createElement("div");
searchResultsTitle.classList.add("main__search-result");
searchResultsTitle.textContent = "Search results:";
searchResultsTitle.style.display = "none";

const searchResultsContainer = document.createElement("div");
searchResultsContainer.classList.add("main__news-grid");
searchResultsContainer.style.display = "none";

const mainTitle = document.createElement("h1");
mainTitle.classList.add("main__title");
mainTitle.textContent = "Fresh news";

const newsGrid = document.createElement("div");
newsGrid.classList.add("main__news-grid");

const paginationContainer = document.createElement("div");
paginationContainer.classList.add("pagination");

const displaySearchResults = (articles) => {
  searchResultsContainer.innerHTML = "";

  if (articles.length > 0) {
    searchResultsContainer.style.display = "";
    searchResultsTitle.style.display = "";

    for (const article of articles) {
      const newsItem = createNewsItem(article);
      searchResultsContainer.appendChild(newsItem);
    }

    mainContainer.insertBefore(searchResultsTitle, searchResultsContainer);
    mainContainer.insertBefore(searchResultsContainer, mainTitle);
  } else {
    searchResultsContainer.style.display = "";
    searchResultsTitle.style.display = "";
    searchResultsContainer.innerHTML = "Nothing was found";
  }
};


const placeholderImageUrl = "styles/img-global/unsplash_xsGxhtAsfSA.png";

const createNewsItem = (article) => {
  const newsItem = document.createElement("div");
  newsItem.classList.add("main__news-item");

  const newsImgContainer = document.createElement("div");
  newsImgContainer.classList.add("main__news-img-container");

  const newsImg = document.createElement("img");
  newsImg.src = article.urlToImage || placeholderImageUrl;
  newsImg.alt = article.title;
  newsImg.classList.add("main__news-image");

  const newsHeading = document.createElement("h2");
  newsHeading.classList.add("main__news-title");
  newsHeading.textContent = article.title;

  const newsDescription = document.createElement("p");
  newsDescription.classList.add("main__news-description");
  newsDescription.textContent = article.description;

  const newsMeta = document.createElement("div");
  newsMeta.classList.add("main__news-meta");
  newsMeta.textContent = `${article.publishedAt} | ${article.source.name}`;

  newsImgContainer.appendChild(newsImg);
  newsItem.appendChild(newsImgContainer);
  newsItem.appendChild(newsHeading);
  newsItem.appendChild(newsDescription);
  newsItem.appendChild(newsMeta);

  return newsItem;
};

const createPaginationButtons = (totalPages, articles) => {
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i.toString();
    pageButton.classList.add('pagination__button');
    if (i === currentPage) {
      pageButton.classList.add('pagination__button--active');
    }
    pageButton.addEventListener('click', () => changePage(i, totalPages, articles));
    paginationContainer.appendChild(pageButton);
  }
};

const displayNewsPage = (pageNumber, totalPages, articles) => {
  newsGrid.innerHTML = '';

  const startIndex = (pageNumber - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;

  for (let i = startIndex; i < endIndex && i < articles.length; i++) {
    const newsItem = createNewsItem(articles[i]);
    newsGrid.appendChild(newsItem);
  }
};

const changePage = (pageNumber, totalPages, articles) => {
  currentPage = pageNumber;
  displayNewsPage(currentPage, totalPages, articles);
  createPaginationButtons(totalPages, articles);

  if (pageNumber === 1) {
    window.history.pushState({}, '', window.location.pathname);
  } else {
    window.history.pushState({}, '', `?page=${pageNumber}`);
  }
};

const displayNews = () => {
  const articles = dataJson.articles;
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  displayNewsPage(currentPage, totalPages, articles);
  createPaginationButtons(totalPages, articles);
};

async function init() {
  try {
    await displayNews();
    console.log('News displayed');
  } catch (error) {
    console.error(error);
  }
}

mainContainer.appendChild(searchResultsContainer);
mainContainer.appendChild(mainTitle);
mainContainer.appendChild(newsGrid);
mainContainer.appendChild(paginationContainer);
main.appendChild(mainContainer);
document.body.appendChild(main);

const footer = document.createElement('footer');
footer.classList.add('footer');

const footerContainer = document.createElement('div');
footerContainer.classList.add('container', 'footer__container');

const logo = document.createElement('div');
logo.classList.add('footer__logo');
const footerLogoImg = document.createElement('img');
footerLogoImg.src = 'styles/img-global/logo.svg';
footerLogoImg.alt = 'Logo';
logo.appendChild(footerLogoImg);

const copyright = document.createElement('div');
copyright.classList.add('footer__copyright');
copyright.textContent = '© 2020-2022 News';

const socialIcons = document.createElement('div');
socialIcons.classList.add('footer__social-icons');

const twitterIconLink = document.createElement('a');
twitterIconLink.href = '#';
twitterIconLink.classList.add('footer__social-icon');
const twitterIconImg = document.createElement('img');
twitterIconImg.src = 'styles/footer/img/twitter.svg';
twitterIconImg.alt = 'twitter';
twitterIconLink.appendChild(twitterIconImg);

const somethingIconLink = document.createElement('a');
somethingIconLink.href = '#';
somethingIconLink.classList.add('footer__social-icon');
const somethingIconImg = document.createElement('img');
somethingIconImg.src = 'styles/footer/img/something.svg';
somethingIconImg.alt = 'smth';
somethingIconLink.appendChild(somethingIconImg);

const vkIconLink = document.createElement('a');
vkIconLink.href = '#';
vkIconLink.classList.add('footer__social-icon');
const vkIconImg = document.createElement('img');
vkIconImg.src = 'styles/footer/img/vk.svg';
vkIconImg.alt = 'vk';
vkIconLink.appendChild(vkIconImg);

socialIcons.appendChild(twitterIconLink);
socialIcons.appendChild(somethingIconLink);
socialIcons.appendChild(vkIconLink);

footerContainer.appendChild(logo);
footerContainer.appendChild(copyright);
footerContainer.appendChild(socialIcons);
footer.appendChild(footerContainer);
document.body.appendChild(footer);

export {
  init,
}