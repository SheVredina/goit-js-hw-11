export const API_KEY = '37248711-c91549f463c72d1d85eaef75b';

export function fetchIMG(query, currentPage) {
  return `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`;
}
