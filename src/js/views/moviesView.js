import View from './view';
import { createMovieCard } from './viewComponents/createMovieCard';

class MoviesView extends View {
  _parentElement = document.querySelector('.movies__grid');
  _errorMessage = 'Failed fetch movies, Please try again';
  _successMessage = '';

  _generateMarkup() {
    return this._data.map(movie => createMovieCard(movie)).join('');
  }
}

export default new MoviesView();
