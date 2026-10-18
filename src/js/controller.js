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

// Grid heading for each category (also used for the tab title)
const PAGE_TITLES = {
  trending: 'Popular on TinyMoviez',
  movie: 'Discover Movies',
  tv: 'Trending TV Shows',
  anime: 'Top Anime',
  topRated: 'Top Rated Content',
  bookmarks: 'Your Bookmarks',
  recent: 'Recently Viewed',
};

/**
 * Picks the hero slides for a category: the category's own list when it has
 * one (so Anime shows anime), otherwise trending.
 * @param {string} type - The active category
 */
const getHeroData = function (type) {
  const list = model.state.library[type];
  return list && list.length > 0 ? list : model.state.library.trending;
};

/**
 * Returns the list a category shows in the grid.
 * @param {string} type - The active category
 */
const getCategoryData = function (type) {
  if (type === 'bookmarks') return model.state.bookmarks;
  if (type === 'recent') return model.state.recent;
  return model.state.library[type];
};

/**
 * Handles category switching (Movies, TV Shows, Anime)
 * @param {string} type - The dataset type from the clicked navigation button
 */
const controlCategory = function (type) {
  if (type === 'more') {
    navigationView.toggleMobileMenu();
    return;
  }

  navigationView.closeMobileMenu();

  // 1. Update state tracking
  model.state.ui.category = type;
  model.state.ui.page = 1;
  model.state.ui.mode = 'category';

  // Update url to match category
  window.location.hash = type;

  // Sync the Topbar and Sidebar visual states
  navigationView.setGlobalActive(type);

  // Leaving search: bring the hero back with slides for this category
  heroView.setData(getHeroData(type));
  heroView.show();

  // Update title (fallback to 'Movies' just in case)
  gridView.updateTitle(PAGE_TITLES[type] || 'Movies');

  // 2. Retrieve cached data for this category
  const data = getCategoryData(type);
  model.state.ui.activeData = data;

  if (!data || data.length === 0) {
    const messages = {
      bookmarks: 'You have no bookmarks yet.',
      recent: 'You have not watched anything yet.',
    };

    gridView.renderError(messages[type]);
    paginationView.clear?.();
    return;
  }

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
  ];

  if (validCategories.includes(hash)) {
    controlCategory(hash);
  }
};

const controlSearch = async function () {
  // Read the query first: an empty submit should do nothing,
  // not leave a spinner on screen
  const query = searchView.getQuery();
  if (!query) return;

  try {
    gridView.renderSpinner();

    await model.loadSearch(query);

    const data = model.state.search.results;

    // Switch app mode to handle pagination correctly
    model.state.ui.mode = 'search';
    model.state.ui.page = 1;
    model.state.ui.activeData = data;

    const results = model.getSearchResult(data);

    gridView.updateTitle(`Search Results for "${query}"`);

    navigationView.setGlobalActive('none');

    // Results replace the hero so they start at the top of the page
    heroView.hide();

    gridView.render(results);

    paginationView.paginationRenderer(
      model.state.ui.page,
      model.getTotalPages(data),
    );

    gridView.scrollToResults();
  } catch (err) {
    gridView.renderError('Could not find any results for that search.');
  }
};

// Application entry point for fetching data
const controlDashboard = async function () {
  gridView.renderSpinner();

  try {
    await model.loadDashboard();
  } catch (err) {
    gridView.renderError('Could not load TinyMoviez. Please refresh.');
    return;
  }

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
  }
};

const controlToggleBookmark = function (id) {
  const itemId = +id;

  // 1. Find the item: the grid first, then any list the hero may be showing
  const item =
    model.state.ui.activeData.find(c => c.id === itemId) ||
    Object.values(model.state.library)
      .flat()
      .find(c => c.id === itemId);

  if (!item) return;

  // 2. Toggle it
  const wasBookmarked = model.state.bookmarks.some(b => b.id === itemId);
  if (wasBookmarked) {
    model.deleteBookmark(itemId);
  } else {
    model.addBookmark(item);
  }

  // 3. On the Bookmarks page the list itself changed, so re-render it
  const onBookmarksPage =
    model.state.ui.mode === 'category' &&
    model.state.ui.category === 'bookmarks';

  if (onBookmarksPage) {
    const totalPages = model.getTotalPages(model.state.bookmarks);

    if (totalPages === 0) {
      gridView.renderError('You have no bookmarks yet.');
      paginationView.clear?.();
    } else {
      model.state.ui.page = Math.min(model.state.ui.page, totalPages);
      gridView.render(model.getSearchResult(model.state.bookmarks));
      paginationView.paginationRenderer(model.state.ui.page, totalPages);
    }
  } else {
    // Everywhere else: update the buttons in place, no re-render
    gridView.syncBookmark(itemId, !wasBookmarked);
  }

  // Keep the Hero button in sync
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

  // Keep the spinner up until the first screen's images are ready
  // (capped at 3s inside preloadImages), so everything appears at once
  const initialType = window.location.hash.slice(1) || 'tv';
  const initialData = getCategoryData(initialType) || [];
  await Promise.all([
    gridView.preload(model.getSearchResult(initialData, 1)),
    heroView.preload(getHeroData(initialType)),
  ]);

  heroView.addHandlerHeroNav();
  gridView.addHandlerBookmark(controlToggleBookmark);

  detailsView.handleDetailsClick(function (type, id) {
    controlDetails(type, id);
  });

  // Closing details puts the tab title back to the page underneath
  detailsView.addHandlerClose(function () {
    gridView.restoreDocumentTitle();
  });

  // 1. Listen for future URL changes
  window.addEventListener('hashchange', controlRouting);

  // 2. Manually run the router right now to load the first page!
  // (This safely replaces both controlCategory('tv') AND the 'load' listener)
  controlRouting();
};

init();
