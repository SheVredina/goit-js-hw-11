import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { fetchIMG, API_KEY } from './api.js';

let currentPage = 1;
let currentQuery = '';

const searchForm = document.getElementById('search-form');
const loadMoreBtn = document.querySelector('.load-more');
const galleryContainer = document.getElementById('gallery');
const endMessage = document.getElementById('end-message');


searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  const searchQuery = e.target.elements.searchQuery.value.trim();
  if (searchQuery === '') {
    return;
  }
  currentQuery = searchQuery;
  currentPage = 1;
  galleryContainer.innerHTML = '';
  await searchImages(searchQuery);
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  await searchImages(currentQuery);
});

async function searchImages(query) {
  const url = fetchIMG(query, currentPage);
  try {
    const response = await axios.get(url);
    const { hits, totalHits } = response.data;

    if (hits.length === 0) {
      if (currentPage === 1) {
        showNotification(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
           return;
    }
    createGallery(hits);
    if (totalHits > currentPage * 40) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
    }
  } catch (error) {
    console.error(error);
  }
}

function createGallery(images) {
  
  const galleryElement = images.map( (image) => {
   return  ` <div class="photo-card">
   <a href="${image.largeImageURL}"><img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width="300"/></a>
   
    <div class="info">
      <p  class="info-item">
        <b>Likes</b>
        <b>${image.likes}</b>
      </p>
      <p class="info-item">
        <b>Views</b>
        <b>${image.views}</b>
      </p>
      <p class="info-item">
      <b>Comments</b> 
      <b>${image.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads</b>
        <b>${image.downloads}</b>
      </p>
    </div>
  </div>`
    } )
  .join("");
  galleryContainer.insertAdjacentHTML("beforeend", galleryElement);

  let lightbox = new SimpleLightbox("#gallery a", {
    captionsData: "alt", 
  captionDelay: 250,
  });
  lightbox.refresh();
  }
  
function showLoadMoreButton() {
  loadMoreBtn.style.display = 'block';
  endMessage.style.display = 'none';
}

function hideLoadMoreButton() {
  loadMoreBtn.style.display = 'none';
  endMessage.style.display = 'block';
  endMessage.textContent = "We're sorry, but you've reached the end of search results.";
}

function showNotification(message) {
  Notiflix.Notify.failure(message);
}
