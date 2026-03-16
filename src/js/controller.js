import * as model from './model';
import animationView from './views/animationView';
import heroView from './views/heroView';
import moviesView from './views/moviesView';
import navigationView from './views/navigationView';
import tvSeriesView from './views/tvseriesView';

console.log(animationView, tvSeriesView, moviesView);

const controlCategory = function (type) {
  if (type === 'movie') {
    moviesView.render(model.state.movies);
    heroView.update(model.state.movies[0]);
  }
  if (type === 'tv') {
    tvSeriesView.render(model.state.series);
    heroView.update(model.state.series[0]);
  }

  if (type === 'anime') {
    animationView.render(model.state.animations);
    heroView.update(model.state.animations[0]);
  }
};

const controlDashboard = async function () {
  moviesView.spinner();
  await model.loadDashboard();

  tvSeriesView.render(model.state.series);
  heroView.update(model.state.series[0]);
};

const controlNavigation = function () {
  navigationView.initNavigation();
};

const init = async function () {
  controlNavigation();
  controlDashboard();

  navigationView.addHandleCategory(controlCategory);
};
init();
