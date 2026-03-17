import * as model from './model';
import gridView from './views/gridView';
import heroView from './views/heroView';
import navigationView from './views/navigationView';
import paginationView from './views/paginationView';
import searchView from './views/searchView';

const controlCategory = function (type) {
  model.state.ui.category = type;
  model.state.ui.page = 1;

  const datasets = {
    movie: model.state.movies,
    tv: model.state.series,
    anime: model.state.animations,
  };

  const data = datasets[type];
  model.state.ui.activeData = data;

  const results = model.getSearchResult(data);

  gridView.render(results);

  heroView.setData(data);

  paginationView.paginationRenderer(
    model.state.ui.page,
    model.getTotalPages(data),
  );
};

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
    if (!query) return;
    await model.loadSearch(query);

    const data = model.state.search.results;
    model.state.ui.mode = 'search';
    model.state.ui.page = 1;
    model.state.ui.activeData = data;

    const results = model.getSearchResult(data);

    gridView.render(results);
    heroView.setData(data);

    paginationView.paginationRenderer(
      model.state.ui.page,
      model.getTotalPages(data),
    );
  } catch (err) {
    gridView.renderError();
  }
};

// Default view
const controlDashboard = async function () {
  gridView.spinner();
  await model.loadDashboard();

  controlCategory('tv');
};

const controlNavigation = function () {
  navigationView.initNavigation();
};

// Initialization
const init = async function () {
  controlNavigation();
  navigationView.addHandleCategory(controlCategory);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandleClick(controlPagination);
  await controlDashboard();
  heroView.addHandlerHeroNav();

  gridView.addHandlerDetails(function (id, type) {
    controlDetails(id, type);
  });
};

init();
