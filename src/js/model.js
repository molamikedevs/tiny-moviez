import {
  ANIME_ORIGINAL_LANGUAGE,
  GENRE_ANIMATION_ID,
  RESULT_PER_PAGE,
  TMDB_API_KEY,
} from '../js/config';
import { AJAX, buildTmdbUrl } from './helpers';

/**
 * APPLICATION STATE
 * Acts as the central "memory" or cache for the application.
 * By storing fetched arrays in the `library`, we avoid making duplicate API calls
 * when the user navigates back and forth between categories.
 */
export const state = {
  library: {
    movie: [], // Match HTML data-type="movie"
    tv: [], // Match HTML data-type="tv"
    anime: [], // Match HTML data-type="anime"
    topRated: [],
    trending: [],
  },

  details: {},
  bookmarks: [],
  upcoming: [],
  theaters: [],
  actors: [],
  recent: [],

  ui: {
    category: 'tv', // Default category
    page: 1,
    activeData: [], // A reference pointing to the currently viewed array in the library
    resultPerPage: RESULT_PER_PAGE,
    mode: 'category',
  },

  search: {
    query: '',
    results: [],
  },
};

/**
 * Second line of defence after include_adult=false in the URL.
 * Drops anything TMDB still flags as adult.
 */
const isSafe = item => item && item.adult !== true;

// Anime = Animation genre + Japanese original language, for TV and movies
const ANIME_PARAMS = {
  with_genres: GENRE_ANIMATION_ID,
  with_original_language: ANIME_ORIGINAL_LANGUAGE,
  sort_by: 'popularity.desc',
};

/**
 * Fetches all initial dashboard data in parallel for maximum performance.
 */
export const loadDashboard = async function () {
  try {
    // Helper function to catch individual errors and return an empty array
    const safeFetch = url =>
      AJAX(url, TMDB_API_KEY).catch(
        () => ({ results: [] }), // Returns empty data so the app doesn't crash
      );

    const [
      trending,
      popularMovies,
      topRated,
      tvSeries,
      animeTv,
      animeMovies,
      upcoming,
      theaters,
      actors,
    ] = await Promise.all([
      safeFetch(buildTmdbUrl('/trending/all/week')),
      safeFetch(buildTmdbUrl('/movie/popular')),
      safeFetch(buildTmdbUrl('/movie/top_rated')),
      safeFetch(buildTmdbUrl('/tv/popular')),
      safeFetch(buildTmdbUrl('/discover/tv', ANIME_PARAMS)),
      safeFetch(buildTmdbUrl('/discover/movie', ANIME_PARAMS)),
      safeFetch(buildTmdbUrl('/movie/upcoming')),
      safeFetch(buildTmdbUrl('/movie/now_playing')),
      safeFetch(buildTmdbUrl('/person/popular')),
    ]);

    // Data Normalization
    state.library.movie = popularMovies.results.filter(isSafe).map(m => ({
      ...m,
      media_type: 'movie',
    }));
    state.library.tv = tvSeries.results
      .filter(isSafe)
      .map(m => ({ ...m, media_type: 'tv' }));

    // Series and films merged, most popular first
    state.library.anime = [
      ...animeTv.results.map(m => ({ ...m, media_type: 'tv' })),
      ...animeMovies.results.map(m => ({ ...m, media_type: 'movie' })),
    ]
      .filter(isSafe)
      .sort((a, b) => b.popularity - a.popularity);

    state.library.topRated = topRated.results.filter(isSafe).map(m => ({
      ...m,
      media_type: 'movie',
    }));

    // trending/all also returns people, who have no backdrop or details page
    state.library.trending = trending.results.filter(
      item => isSafe(item) && item.media_type !== 'person',
    );

    // Sidebar Data
    state.upcoming = upcoming.results.filter(isSafe);
    state.theaters = theaters.results.filter(isSafe);
    state.actors = actors.results.filter(isSafe);
  } catch (err) {
    throw err; // The controller shows the error to the user
  }
};

/**
 * Returns a specific slice of the active array based on the current page number.
 * Used for client-side pagination.
 */
export const getSearchResult = function (data, page = state.ui.page) {
  const start = (page - 1) * state.ui.resultPerPage; // e.g., Page 1: (1-1) * 10 = 0
  const end = page * state.ui.resultPerPage; // e.g., Page 1: 1 * 10 = 10

  return data.slice(start, end); // Returns items 0-9
};

export const getTotalPages = function (data) {
  return Math.ceil(data.length / state.ui.resultPerPage);
};

export const loadSearch = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(
      buildTmdbUrl('/search/multi', { query }),
      TMDB_API_KEY,
    );

    // Filter out actors/directors and anything flagged adult
    state.search.results = data.results.filter(
      item => isSafe(item) && item.media_type !== 'person',
    );
    state.search.page = 1;
  } catch (err) {
    throw err; // Throwing here allows the Controller to catch it and trigger renderError()
  }
};

export const loadDetails = async function (type, id) {
  try {
    const data = await AJAX(buildTmdbUrl(`/${type}/${id}`), TMDB_API_KEY);

    // Never open a details view for adult content
    if (!isSafe(data)) throw new Error('This title is not available');

    state.details = { ...data, media_type: type };
  } catch (err) {
    throw err;
  }
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (item) {
  // Push the entire object (whether it's TV, Anime, or Movie) into the array
  state.bookmarks.push(item);
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Find the exact position of the item we want to remove
  const index = state.bookmarks.findIndex(el => el.id === id);

  // Remove 1 element at that index
  state.bookmarks.splice(index, 1);

  // Mark current item as NOT bookmarked
  if (id === state.details.id) state.details.bookmarked = false;
  persistBookmarks();
};

// Initialize the bookmarks from LocalStorage when the app loads
const initBookmarks = function () {
  const storage = localStorage.getItem('bookmarks');

  // If there is data in storage, parse the JSON string back into an array/objects
  if (storage) state.bookmarks = JSON.parse(storage).filter(isSafe);
};
initBookmarks();

// Save to storage
const persistRecent = function () {
  localStorage.setItem('recent', JSON.stringify(state.recent));
};

// Add a viewed item to the history
export const addRecent = function (item) {
  // 1. Check if the movie is ALREADY in the recent list
  const existingIndex = state.recent.findIndex(el => el.id === item.id);

  // 2. If it is, remove it from its old spot
  if (existingIndex > -1) {
    state.recent.splice(existingIndex, 1);
  }
  // 3. Add it to the VERY FRONT of the array (so newest is first!)
  state.recent.unshift(item);

  if (state.recent.length > 20) {
    state.recent.pop(); // Removes the oldest item at the end
  }

  persistRecent();
};

const initRecent = function () {
  const storage = localStorage.getItem('recent');
  if (storage) state.recent = JSON.parse(storage).filter(isSafe);
};

initRecent();
