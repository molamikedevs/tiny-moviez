import View from './view';

class HeroView extends View {
  _img = document.querySelector('.hero__img');
  _title = document.querySelector('.hero__title');

  update(data) {
    const IMG = 'https://image.tmdb.org/t/p/original';
    const title = data.title || data.name;

    this._img.src = IMG + data.backdrop_path;
    this._title.textContent = title;
  }
}

export default new HeroView();
