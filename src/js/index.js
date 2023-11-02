import { getImages } from "./pixabay-api";
import { refs } from "./refs";
import { Notify } from "notiflix";
import { lightbox } from "./lightbox";


const paramsNotify = {
  position: 'center-center',
  fontSize: '30px',
  timeout: 2000,
  width: '500px',
};
Notify.info('Please enter your search query.', paramsNotify);

refs.searchForm.addEventListener('submit', onSearchClick);
refs.loadMore.addEventListener('click', onLoadMoreClick);

let q;
let page;

async function onSearchClick(e) {
  e.preventDefault();
  page = 1;
  
  const formData = new FormData(e.target);
  q = formData.get("searchQuery");

  if (q === ""){
    refs.photoGallery.innerHTML = "";
    refs.loadMore.classList.add('load-more-hidden');
    Notify.info('Please enter your search query.', paramsNotify);
    return;
  }

  try{
    const response = await getImages(q, page);
    console.log(response.data.hits);

    if (response.data.hits.length === 0) {
      Notify.info('Sorry, there are no images matching your search query. Please try again.', paramsNotify);
      return;
    }

    if (response.status !== 200 ) {
            throw new Error(response.statusText);
          }
    const totalPictures = await response.data.totalHits;

    Notify.success(`Hooray! We found ${totalPictures} images.`, paramsNotify);

    refs.loadMore.classList.remove('load-more-hidden');

    refs.photoGallery.innerHTML = createMarkup(response.data.hits);
    lightbox.refresh();
  } 
  catch (onFetchError) {
    console.log(onFetchError);
};
}

function createMarkup(arr){
  return arr.map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
    return `<div class="photo-card">
    <div class="img_wrap">
        <a class="gallery_link" href="${largeImageURL}">
            <img src="${webformatURL}" 
                 alt="${tags}" 
                 loading="lazy" 
                //  height="200";
                width="300";/>
        </a>
    </div>
    <div class="info">
        <p class="info-item">
        <b>Likes</b> ${likes}
        </p>
        <p class="info-item">
        <b>Views</b> ${views}
        </p>
        <p class="info-item">
        <b>Comments</b> ${comments}
        </p>
        <p class="info-item">
        <b>Downloads</b> ${downloads}
        </p>
    </div>
    </div>`
}).join('');
}

function onLoadMoreClick() {
  page +=1;

  getImages(q, page)
  .then(response => {
    refs.photoGallery.insertAdjacentHTML("beforeend", createMarkup(response.data.hits));
    lightbox.refresh();


    const { height: cardHeight } = refs.photoGallery
      .firstElementChild.getBoundingClientRect();

      window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });

    const numberOfPage = Math.ceil(response.data.totalHits / 40);

    if (page === numberOfPage) {
      refs.loadMore.classList.add('load-more-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.", paramsNotify);
    }
  })
  .catch(onFetchError);
}; 

function onFetchError() {
  Notify.failure('Oops! Something went wrong! Try reloading the page or make another choice!', paramsNotify);
};


  