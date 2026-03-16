import View from './view';
import { createMovieCard } from './viewComponents/createMovieCard';

class TVseriesView extends View {
  _parentElement = document.querySelector('.movies__grid');
  _generateMarkup() {
    return this._data.map(show => createMovieCard(show)).join('');
  }
}

export default new TVseriesView();
