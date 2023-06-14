const API_KEY = '37248711-c91549f463c72d1d85eaef75b';
let currentPage = 1;
let currentQuery = '';

const searchForm = document.getElementById('search-form');
const loadMoreBtn = document.querySelector('.load-more');
const galleryContainer = document.getElementById('gallery');

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
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`;

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
  images.forEach(image => {
    const card = document.createElement('div');
    card.classList.add('photo-card');

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.classList.add('info');

    const likes = createInfoItem('Likes', image.likes);
    const views = createInfoItem('Views', image.views);
    const comments = createInfoItem('Comments', image.comments);
    const downloads = createInfoItem('Downloads', image.downloads);

    info.append(likes, views, comments, downloads);
    card.append(img, info);
    galleryContainer.append(card);
  });
}

function createInfoItem(label, value) {
  const p = document.createElement('p');
  p.classList.add('info-item');
  p.innerHTML = `<b>${label}:</b> ${value}`;
  return p;
}

function showLoadMoreButton() {
  loadMoreBtn.style.display = 'block';
}

function hideLoadMoreButton() {
  loadMoreBtn.style.display = 'none';
}

function showNotification(message) {
  alert(message);
}
