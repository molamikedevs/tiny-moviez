import { TMDB_API_KEY, TMDB_BASE_URL } from '../js/config';
import { AJAX } from './helpers';

export const state = {
  movies: {},
  series: {},
  animations: {},
  topRated: {},
  trending: {},
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
