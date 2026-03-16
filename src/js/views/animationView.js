import View from './view';
import { createMovieCard } from './viewComponents/createMovieCard';

class AnimationView extends View {
  _parentElement = document.querySelector('.movies__grid');
  _generateMarkup() {
    return this._data.map(item => createMovieCard(item)).join('');
  }
}

export default new AnimationView();
