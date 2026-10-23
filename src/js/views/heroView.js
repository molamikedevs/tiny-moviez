import { preloadImages } from '../helpers';
import View from './view';

// w1280 is sharp at hero size and a fraction of the 'original' file size
const IMG = 'https://image.tmdb.org/t/p/w1280';

class HeroView extends View {
  _hero = document.querySelector('.hero');
  _img = document.querySelector('.hero__img');
  _title = document.querySelector('.hero__title');

  _btnPrev = document.querySelector('.slider__btn--prev');
  _btnNext = document.querySelector('.slider__btn--next');

  _data = [];
  _current = 0;
  _timer;
  _renderId = 0;
  _bookmarkedIds = []; // Set by the controller, so the view never reads the model

  // A slide needs a backdrop image to render
  _getSlides(data = []) {
    return data.filter(movie => movie.backdrop_path);
  }

  /**
   * Warms up the first slide's backdrop so the hero appears complete.
   * @param {Object[]} data - The items the hero will show
   */
  preload(data = []) {
    const [first] = this._getSlides(data);
    return preloadImages(first ? [IMG + first.backdrop_path] : []);
  }

  setData(data = []) {
    const slides = this._getSlides(data);
    if (slides.length === 0) return;

    this._data = slides;
    this._current = 0;

    this.renderHero();
    this._startAutoSlide();
  }

  /**
   * Receives the bookmarked ids from the controller and refreshes the button.
   * @param {number[]} ids
   */
  setBookmarkedIds(ids = []) {
    this._bookmarkedIds = ids;
    this.renderHero();
  }

  show() {
    this._hero.hidden = false;
  }

  hide() {
    this._hero.hidden = true;
  }

  /**
   * Swaps the backdrop only after the new image is decoded, so the
   * hero never shows a half-drawn picture. Fast clicks keep the latest.
   */
  _setImage(src) {
    if (this._img.getAttribute('src') === src) return;

    const renderId = ++this._renderId;
    const next = new Image();
    next.src = src;

    next
      .decode()
      .catch(() => {})
      .then(() => {
        if (renderId !== this._renderId) return; // a newer slide won
        this._img.src = src;
        this._img.classList.add('is-loaded');
      });
  }

  renderHero() {
    const movie = this._data[this._current];
    if (!movie) return;

    const title = movie.title || movie.name;

    this._setImage(IMG + movie.backdrop_path);
    this._title.textContent = title;

    const btnDetails = document.querySelector('.hero .btn--primary');
    const btnBookmark = document.querySelector('.hero .btn--bookmark');

    // Inject data into Details
    if (btnDetails) {
      btnDetails.dataset.id = movie.id;
      btnDetails.dataset.type = movie.media_type;
      btnDetails.setAttribute('aria-label', `View details for ${title}`);
    }

    // Inject data into Bookmark
    if (btnBookmark) {
      btnBookmark.dataset.id = movie.id;
      btnBookmark.dataset.type = movie.media_type;

      // Check if this movie is currently saved
      const isBookmarked = this._bookmarkedIds.includes(movie.id);
      btnBookmark.textContent = isBookmarked ? 'Bookmarked' : 'Bookmark';
      btnBookmark.classList.toggle('is-bookmarked', isBookmarked);
      btnBookmark.setAttribute('aria-pressed', String(isBookmarked));
    }
  }
  addHandlerHeroNav() {
    this._btnNext.addEventListener('click', () => {
      this._next();
      this._startAutoSlide(); // a manual change restarts the timer
    });

    this._btnPrev.addEventListener('click', () => {
      this._prev();
      this._startAutoSlide();
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
