import View from './view';
import { createMovieCard } from './viewComponents/createMovieCard';

class GridView extends View {
  _parentElement = document.querySelector('.movies__grid');
  _errorMessage = 'Failed to load content';

  _generateMarkup() {
    return this._data.map(movie => createMovieCard(movie)).join('');
  }

  addHandlerDetails(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--details');

      if (!btn) return;

      const card = btn.closest('.movie-card');

      const id = card.dataset.id;
      const type = card.dataset.type;

      handler(id, type);
    });
  }
}

export default new GridView();
