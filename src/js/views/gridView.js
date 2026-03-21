import View from './view';
import { createMovieCard } from './viewComponents/createMovieCard';

class GridView extends View {
  _parentElement = document.querySelector('.movies__grid');
  _errorMessage = 'Failed to load content';
  _titleElement = document.querySelector('.section__title');

  _generateMarkup() {
    return this._data.map(movie => createMovieCard(movie)).join('');
  }

  addHandlerBookmark(handler) {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;

      // Extract the ID and pass it to the Controller
      const id = btn.dataset.id;
      handler(id);
    });
  }

  updateTitle(title) {
    if (this._titleElement) {
      this._titleElement.textContent = title;
    }

    document.title = `${title} | TinyMoviez`;
  }
}

export default new GridView();
