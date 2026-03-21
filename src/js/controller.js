import * as model from './model';
import actorsView from './views/actorsView.js';
import detailsView from './views/detailsView.js';
import gridView from './views/gridView';
import heroView from './views/heroView';
import navigationView from './views/navigationView';
import paginationView from './views/paginationView';
import searchView from './views/searchView';
import theatersView from './views/theatersView.js';
import upcomingView from './views/upcomingView.js';

/**
 * Handles category switching (Movies, TV Shows, Anime)
 * @param {string} type - The dataset type from the clicked navigation button
 */
const controlCategory = function (type) {
  // 1. Update state tracking
  model.state.ui.category = type;
  model.state.ui.page = 1;

  // Update url to match category
  window.location.hash = type;

  // Sync the Topbar and Sidebar visual states
  navigationView.setGlobalActive(type);

  // Map data types to dynamic titles and update the UI
  const pageTitles = {
    trending: 'Popular on TinyMoviez',
    movie: 'Discover Movies',
    tv: 'Trending TV Shows',
    anime: 'Top Anime',
    topRated: 'Top Rated Content',
    bookmarks: 'Your Bookmarks',
    recent: 'Recently Viewed',
  };

  // Update title (fallback to 'Movies' just in case)
  gridView.updateTitle(pageTitles[type] || 'Movies');

  // 2. Retrieve cached data dynamically using bracket notation
  let data;
  if (type === 'bookmarks') {
    data = model.state.bookmarks;
  } else if (type === 'recent') {
    data = model.state.recent;
  } else {
    data = model.state.library[type];
  }
  model.state.ui.activeData = data;

  // 3. Get only the 10 results needed for page 1
  const results = model.getSearchResult(data);

  // 4. Update the UI components
  gridView.render(results);
  paginationView.paginationRenderer(
    model.state.ui.page,
    model.getTotalPages(data),
  );
};

/**
 * Handles pagination clicks
 * @param {number} page - The page number the user wishes to navigate to
 */
const controlPagination = function (page) {
  model.state.ui.page = page;

  const data = model.state.ui.activeData;
  const results = model.getSearchResult(data);

  gridView.render(results);
  paginationView.paginationRenderer(page, model.getTotalPages(data));
};

const controlRouting = function () {
  // 1. Get the hash from the URL and remove the '#' symbol
  const hash = window.location.hash.slice(1);

  // 2. If there is no hash (e.g., first time loading the app), default to 'tv'
  if (!hash) {
    window.location.hash = 'tv';
    return;
  }

  // 3. Define our valid navigation categories
  const validCategories = [
    'movie',
    'tv',
    'anime',
    'trending',
    'topRated',
    'bookmarks',
    'upcoming',
    'recent',
    'home',
  ];

  if (validCategories.includes(hash)) {
    controlCategory(hash);
  }
};

const controlSearch = async function () {
  try {
    gridView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearch(query);

    const data = model.state.search.results;

    // Switch app mode to handle pagination correctly
    model.state.ui.mode = 'search';
    model.state.ui.page = 1;
    model.state.ui.activeData = data;

    const results = model.getSearchResult(data);

    gridView.updateTitle(`Search Results for "${query}"`);

    navigationView.setGlobalActive('none');

    gridView.render(results);

    paginationView.paginationRenderer(
      model.state.ui.page,
      model.getTotalPages(data),
    );
  } catch (err) {
    gridView.renderError('Could not find any results for that search.');
  }
};

// Application entry point for fetching data
const controlDashboard = async function () {
  gridView.renderSpinner();
  await model.loadDashboard();

  //Initialize the hero with trending movies once
  heroView.setData(model.state.library.trending);

  upcomingView.render(model.state.upcoming);
  upcomingView.addHandlerPagination();

  actorsView.render(model.state.actors);
  actorsView.addHandlerPagination();

  theatersView.render(model.state.theaters);
  theatersView.addHandlerPagination();
};

const controlDetails = async function (type, id) {
  try {
    // 1. Render.renderSpinner
    detailsView.renderSpinner();

    // 2. Fetch the data
    await model.loadDetails(type, id);

    // 3. Add this item to the Recently Viewed history!
    model.addRecent(model.state.details);

    const movieTitle = model.state.details.title || model.state.details.name;
    document.title = `${movieTitle} | TinyMoviez`;

    // 4. Render the modal
    detailsView.detailsRenderer(model.state.details);
  } catch (err) {
    detailsView.renderError();
    console.error(`💥💥 ${err}`);
  }
};

const controlToggleBookmark = function (id) {
  // 1. Find the movie object in our currently active data or trending data
  let category = model.state.ui.activeData.find(c => c.id === +id);

  // If clicked from the Hero banner, it might be in trending
  if (!category) {
    category = model.state.library.trending.find(t => t.id === +id);
  }

  if (!category) return;

  // 2. Check if it's already bookmarked
  const isBookmarked = model.state.bookmarks.some(b => b.id === +id);
  if (!isBookmarked) {
    model.addBookmark(category);
  } else {
    model.deleteBookmark(+id);
  }

  // 4. Re-render the grid so the UI updates
  gridView.render(model.getSearchResult(model.state.ui.activeData));

  // Instantly updates the Hero button UI!
  heroView.renderHero();
};

/**
 * INITIALIZATION
 * Uses the Publisher-Subscriber pattern. The Controller passes its functions
 * to the Views. The Views "listen" for DOM events and execute these functions.
 * This keeps the Controller clean of any DOM manipulation.
 */
const init = async function () {
  // Registering event handlers
  navigationView.addHandleCategory(controlCategory);
  navigationView.addHandleSidebar(controlCategory);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandleClick(controlPagination);

  // Load initial data
  await controlDashboard();

  heroView.addHandlerHeroNav();
  gridView.addHandlerBookmark(controlToggleBookmark);

  detailsView.handleDetailsClick(function (type, id) {
    controlDetails(type, id);
  });

  detailsView.addHandlerClose(function () {
    const currentCategory = model.state.ui.category;
    const pageTitles = {
      trending: 'Popular on TinyMoviez',
      movie: 'Discover Movies',
      tv: 'Trending TV Shows',
      anime: 'Top Anime',
      topRated: 'Top Rated Content',
      bookmarks: 'Your Bookmarks',
      recent: 'Recently Viewed',
      search: 'Search Results',
    };

    document.title = `${pageTitles[currentCategory] || 'Movies'} | TinyMoviez`;
  });

  // 1. Listen for future URL changes
  window.addEventListener('hashchange', controlRouting);

  // 2. Manually run the router right now to load the first page!
  // (This safely replaces both controlCategory('tv') AND the 'load' listener)
  controlRouting();
};

init();
