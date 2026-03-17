import { RESULT_PER_PAGE, TMDB_API_KEY, TMDB_BASE_URL } from '../js/config';
import { AJAX } from './helpers';

export const state = {
  movies: {},
  series: {},
  animations: {},
  topRated: {},
  trending: {},

  details: {},

  ui: {
    category: 'tv',
    page: 1,
    activeData: [],
    resultPerPage: RESULT_PER_PAGE,
    mode: 'category',
  },

  search: {
    query: '',
    results: [],
  },
};

export const loadDashboard = async function () {
  try {
    const [trending, popularMovies, topRated, tvSeries, animation] =
      await Promise.all([
        AJAX(`${TMDB_BASE_URL}/trending/all/week`, TMDB_API_KEY),
        AJAX(`${TMDB_BASE_URL}/movie/popular`, TMDB_API_KEY),
        AJAX(`${TMDB_BASE_URL}/movie/top_rated`, TMDB_API_KEY),
        AJAX(`${TMDB_BASE_URL}/tv/popular`, TMDB_API_KEY),
        AJAX(`${TMDB_BASE_URL}/discover/movie?with_genres=16`, TMDB_API_KEY),
      ]);

    state.movies = popularMovies.results;
    state.series = tvSeries.results;
    state.animations = animation.results;
    state.trending = trending.results;
    state.topRated = topRated.results;
  } catch (err) {
    console.error(err);
  }
};

export const getSearchResult = function (data, page = state.ui.page) {
  const start = (page - 1) * state.ui.resultPerPage;
  const end = page * state.ui.resultPerPage;

  return data.slice(start, end);
};

export const getTotalPages = function (data) {
  return Math.ceil(data.length / state.ui.resultPerPage);
};

export const loadSearch = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(
      `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query)}`,
      TMDB_API_KEY,
    );

    state.search.results = data.results.filter(
      item => item.media_type !== 'person',
    );

    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const loadDetails = async function (type, id) {
  try {
    const data = await AJAX(`${TMDB_BASE_URL}/${type}/${id}`, TMDB_API_KEY);

    state.details = data;
  } catch (err) {
    throw err;
  }
};
