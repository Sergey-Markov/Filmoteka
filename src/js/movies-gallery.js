import movieCardTpl from '../templates/main-gallery.hbs';
import refs from './refs';
import filmoteka from './ApiService';
import { transformDate, transformGenre } from './changeDateAndGenres';
import { startPagination } from './pagination';

async function renderPopularMovies() {
  const { page, results, total_pages, total_results } = await filmoteka.getAllMovies();

  const genresObj = await filmoteka.fetchGenres();
  const genresList = [...genresObj];
  console.log(genresList);

  filmoteka.s``etTotalPages``(total_pages);
  transformDate(results);
  transformGenre(results, genresList);

  const markup = movieCardTpl(results);

  clearMovieContainer();
  refs.movieContainer.insertAdjacentHTML('beforeend', markup);

  //вызываем пагинацию, передаем туда какой запрос пагинировать
  startPagination(renderPopularMovies);
}

// вызываем рендер главной страницы
renderPopularMovies();

refs.searchForm.addEventListener('submit', onSearch);

async function onSearch(e) {
  if (e !== undefined) {
    e.preventDefault();

    filmoteka.query = e.currentTarget.elements.query.value;

    if (filmoteka.query === '') {
      return alert('Оповещение: введите название фильма');
    }

    filmoteka.resetPage();
  }

  const { page, results, total_pages, total_results } = await filmoteka.getMovies();

  filmoteka.totalPages = total_pages;

  clearMovieContainer();
  renderMovieCard(results);

  //вызываем пагинацию, передаем туда какой запрос пагинировать
  startPagination(onSearch);

  // filmoteka.getMovies().then(resluts => {
  //   clearMovieContainer();
  //   renderMovieCard(resluts);
  // });

  // e.currentTarget.elements.query.value = '';
}

function onLoadMore() {
  filmoteka.getMovies().then(renderMovieCard);
}

function renderMovieCard(resluts) {
  refs.movieContainer.insertAdjacentHTML('beforeend', movieCardTpl(resluts));
}

function clearMovieContainer() {
  refs.movieContainer.innerHTML = '';
}

export { renderPopularMovies };
