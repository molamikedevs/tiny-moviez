import {
  GENRE_ANIMATION_ID,
  RESULT_PER_PAGE,
  TMDB_API_KEY,
  TMDB_BASE_URL,
} from '../js/config';
import { AJAX } from './helpers';

/**
 * APPLICATION STATE
 * Acts as the central "memory" or cache for the application.
 * By storing fetched arrays in the `library`, we avoid making duplicate API calls
 * when the user navigates back and forth between categories.
 */
export const state = {
  library: {
    movie: [], // Renamed to match HTML data-type="movie"
    tv: [], // Renamed to match HTML data-type="tv"
    anime: [], // Renamed to match HTML data-type="anime"
    topRated: [],
    trending: [],
  },

  details: {},
  bookmarks: [],

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
 * Fetches all initial dashboard data in parallel for maximum performance.
 */
export const loadDashboard = async function () {
  try {
    // Promise.all allows us to fetch all 5 endpoints simultaneously
    // rather than waiting for one to finish before starting the next.
    const [trending, popularMovies, topRated, tvSeries, animation] =
      await Promise.all([
        AJAX(`${TMDB_BASE_URL}/trending/all/week`, TMDB_API_KEY),
        AJAX(`${TMDB_BASE_URL}/movie/popular`, TMDB_API_KEY),
        AJAX(`${TMDB_BASE_URL}/movie/top_rated`, TMDB_API_KEY),
        AJAX(`${TMDB_BASE_URL}/tv/popular`, TMDB_API_KEY),
        AJAX(
          `${TMDB_BASE_URL}/discover/movie?with_genres=${GENRE_ANIMATION_ID}`,
          TMDB_API_KEY,
        ),
      ]);

    // Data Normalization: We manually inject `media_type` into the objects
    // so our Views never have to guess what type of content they are rendering.
    state.library.movie = popularMovies.results.map(m => ({
      ...m,
      media_type: 'movie',
    }));
    state.library.tv = tvSeries.results.map(m => ({
      ...m,
      media_type: 'tv',
    }));
    state.library.anime = animation.results.map(m => ({
      ...m,
      media_type: 'movie',
    }));

    // Fixed: Ensure these are saved inside state.library
    state.library.topRated = topRated.results.map(m => ({
      ...m,
      media_type: 'movie',
    }));
    state.library.trending = trending.results; // Trending natively includes media_type
  } catch (err) {
    console.error(`💥 Error loading dashboard: ${err}`);
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
      `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query)}`,
      TMDB_API_KEY,
    );

    // Filter out actors/directors from the search results
    state.search.results = data.results.filter(
      item => item.media_type !== 'person',
    );
    state.search.page = 1;
  } catch (err) {
    throw err; // Throwing here allows the Controller to catch it and trigger renderError()
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

export const persistBookmarks = function () {
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
  if (storage) state.bookmarks = JSON.parse(storage);
};
initBookmarks();
