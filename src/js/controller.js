import * as model from './model';
import detailsView from './views/detailsView.js';
import gridView from './views/gridView';
import heroView from './views/heroView';
import navigationView from './views/navigationView';
import paginationView from './views/paginationView';
import searchView from './views/searchView';

/**
 * Handles category switching (Movies, TV Shows, Anime)
 * @param {string} type - The dataset type from the clicked navigation button
 */
const controlCategory = function (type) {
  // 1. Update state tracking
  model.state.ui.category = type;
  model.state.ui.page = 1;

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
  };

  // Update title (fallback to 'Movies' just in case)
  gridView.updateTitle(pageTitles[type] || 'Movies');

  // 2. Retrieve cached data dynamically using bracket notation
  let data;
  if (type === 'bookmarks') {
    data = model.state.bookmarks;
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

const controlSearch = async function () {
  try {
    gridView.spinner();

    const query = searchView.getQuery();
    if (!query) return; // Guard clause: Exit if search is empty

    await model.loadSearch(query);

    const data = model.state.search.results;

    // Switch app mode to handle pagination correctly
    model.state.ui.mode = 'search';
    model.state.ui.page = 1;
    model.state.ui.activeData = data;

    const results = model.getSearchResult(data);

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
  gridView.spinner();
  await model.loadDashboard();

  // Render TV shows as the initial default state
  controlCategory('tv');

  //Initialize the hero with trending movies once
  heroView.setData(model.state.library.trending);
};

const controlDetails = async function (type, id) {
  try {
    await model.loadDetails(type, id);
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

  detailsView.addHandlerClose();
};

init();
