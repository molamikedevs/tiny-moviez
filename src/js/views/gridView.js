import View from './view';
import { createMovieCard } from './viewComponents/createMovieCard';

class GridView extends View {
  _parentElement = document.querySelector('.movies__grid');
  _errorMessage = 'Failed to load content';

  _generateMarkup() {
    return this._data.map(movie => createMovieCard(movie)).join('');
  }
}

export default new GridView();
