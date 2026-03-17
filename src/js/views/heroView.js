import View from './view';

class HeroView extends View {
  _img = document.querySelector('.hero__img');
  _title = document.querySelector('.hero__title');

  _btnPrev = document.querySelector('.slider__btn--prev');
  _btnNext = document.querySelector('.slider__btn--next');

  _data = [];
  _current = 0;
  _timer;

  setData(data) {
    this._data = data;
    this._current = 0;

    this.renderHero();
    this._startAutoSlide();
  }

  renderHero() {
    const movie = this._data[this._current];
    const IMG = 'https://image.tmdb.org/t/p/original';
    const title = movie.title || movie.name;

    this._img.src = IMG + movie.backdrop_path;
    this._title.textContent = title;
  }

  addHandlerHeroNav() {
    this._btnNext.addEventListener('click', () => {
      this._next();
    });

    this._btnPrev.addEventListener('click', () => {
      this._prev();
    });
  }

  _next() {
    this._current++;

    if (this._current >= this._data.length) this._current = 0;

    this.renderHero();
  }

  _prev() {
    this._current--;
    if (this._current < 0) this._current = this._data.length - 1;

    this.renderHero();
  }

  _startAutoSlide() {
    clearInterval(this._timer);

    this._timer = setInterval(() => {
      this._next();
    }, 30000);
  }
}

export default new HeroView();
