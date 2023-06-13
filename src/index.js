// import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

function createBreedOption(breed) {
  error.style.display = 'none';

  const option = document.createElement('option');
  option.value = breed.id;
  option.textContent = breed.name;
  breedSelect.appendChild(option);
}

function displayCatInfo(cat) {
  catInfo.innerHTML = `
    <img src="${cat.url}" alt="Cat Image" width= "300" />
    <h3>${cat.breeds[0].name}</h3>
    <p> ${cat.breeds[0].description}</p>
    <p> ${cat.breeds[0].temperament}</p> `;
  catInfo.style.display = 'block';
}

breedSelect.addEventListener('change', () => {
  const selectedBreedId = breedSelect.value;

  if (selectedBreedId) {
    loader.style.display = 'block';
    catInfo.style.display = 'none';
    error.style.display = 'none';

    fetchCatByBreed(selectedBreedId)
      .then(cat => {
        displayCatInfo(cat);
        loader.style.display = 'none';
      })
      .catch(() => {
        Notiflix.Notify.info(`❌Такого котика не найдено, поищите другого...`);
        loader.style.display = 'none';
      });
  } else {
    catInfo.style.display = 'none';
  }
});

fetchBreeds()
  .then(breeds => {
    breeds.forEach(breed => createBreedOption(breed));
    loader.style.display = 'none';
  })
  .catch(() => {
    Notiflix.Notify.warning(
      `Oops! Something went wrong! Try reloading the page!`
    );
    loader.style.display = 'none';
  });
