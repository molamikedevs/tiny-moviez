import { preloadImages } from '../helpers';
import View from './view';
import {
  createMovieCard,
  getPosterUrl,
  noPosterImg,
} from './viewComponents/createMovieCard';

class GridView extends View {
  _parentElement = document.querySelector('.movies__grid');
  _errorMessage = 'Failed to load content';
  _titleElement = document.querySelector('.section__title');
  _section = document.querySelector('.movies');
  _pageTitle = 'TinyMoviez';

  constructor() {
    super();
    this._addHandlerPosterLoad();
  }

  _generateMarkup() {
    return this._data.map(movie => createMovieCard(movie)).join('');
  }

  /**
   * Fades each poster in once it has loaded, and swaps in the default
   * poster when an image fails. Load and error events don't bubble,
   * so one capturing listener on the grid covers every card ever rendered.
   */
  _addHandlerPosterLoad() {
    const markLoaded = e => {
      const img = e.target;
      if (!img.classList.contains('movie-card__poster')) return;

      if (e.type === 'error' && !img.src.endsWith(noPosterImg)) {
        img.src = noPosterImg; // retry once with the fallback
        return;
      }

      img.classList.add('is-loaded');
    };

    this._parentElement.addEventListener('load', markLoaded, true);
    this._parentElement.addEventListener('error', markLoaded, true);
  }

  /**
   * Warms up the posters for a set of items so they appear together.
   * @param {Object[]} items - The items about to be rendered
   */
  preload(items = []) {
    return preloadImages(items.map(getPosterUrl));
  }

  addHandlerBookmark(handler) {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.js-bookmark');
      if (!btn) return;

      // Instant feedback: play the pop animation, remove the class when done
      btn.classList.add('is-popping');
      btn.addEventListener(
        'animationend',
        () => btn.classList.remove('is-popping'),
        { once: true },
      );

      // Extract the ID and pass it to the Controller
      const id = btn.dataset.id;
      handler(id);
    });
  }

  /**
   * Updates every card bookmark button for one title without a re-render,
   * so the pop animation is not interrupted.
   * @param {number|string} id
   * @param {boolean} isBookmarked
   */
  syncBookmark(id, isBookmarked) {
    const buttons = this._parentElement.querySelectorAll(
      `.movie-card__bookmark[data-id="${id}"]`,
    );

    buttons.forEach(btn => {
      const title =
        btn.closest('.movie-card')?.querySelector('.movie-card__title')
          ?.textContent ?? '';

      btn.classList.toggle('is-bookmarked', isBookmarked);
      btn.setAttribute('aria-pressed', String(isBookmarked));
      btn.setAttribute(
        'aria-label',
        isBookmarked ? `Remove ${title} from bookmarks` : `Bookmark ${title}`,
      );
      btn.title = isBookmarked ? 'Remove bookmark' : 'Bookmark';
    });
  }

  updateTitle(title) {
    if (this._titleElement) {
      this._titleElement.textContent = title;
    }

    this._pageTitle = title;
    this.restoreDocumentTitle();
  }

  // Puts the tab title back to the current page (after the modal closes)
  restoreDocumentTitle() {
    document.title = `${this._pageTitle} | TinyMoviez`;
  }

  // Brings the results heading to the top, below the sticky topbar
  scrollToResults() {
    if (!this._section) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    this._section.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }
}

export default new GridView();
