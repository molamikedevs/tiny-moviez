import noPosterImg from 'url:../../img/no-poster.png';
import { escapeHTML } from '../helpers';
import View from './view';

class DetailsView extends View {
  _parentElement = document.querySelector('.modal');
  _errorMessage = 'Failed to load details';

  // The page behind the dialog; made inert while it is open
  _page = document.querySelector('.dashboard');

  _lastFocus = null;
  _onClose = null;

  detailsRenderer(data) {
    const IMG = 'https://image.tmdb.org/t/p/w500';
    const title = escapeHTML(data.title || data.name || 'Untitled');

    const date = data.release_date || data.first_air_date || '';
    const year = date ? date.slice(0, 4) : 'N/A';
    const country =
      data.origin_country && data.origin_country.length > 0
        ? data.origin_country[0]
        : 'N/A';

    const rating = data.vote_average ? data.vote_average.toFixed(1) : 'N/A';
    const votes = data.vote_count ? data.vote_count.toLocaleString() : 'N/A';
    const popularity = data.popularity ? Math.round(data.popularity) : 'N/A';
    const overview = escapeHTML(
      data.overview || 'No overview available for this title.',
    );
    const poster = data.poster_path ? IMG + data.poster_path : noPosterImg;

    const markup = `
      <div
        class="modal__content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button class="modal__close" type="button" aria-label="Close details">
          <span aria-hidden="true">×</span>
        </button>

        <div class="modal__body">
          <img class="modal__poster" src="${poster}" alt="" />

          <div class="modal__info">
            <h2 class="modal__title" id="modal-title">${title}</h2>

            <div class="modal__meta">
              <span class="modal__rating">
                <span aria-hidden="true">&#9733;</span> ${rating}
              </span>
              <span class="modal__divider" aria-hidden="true">|</span>
              <span>${year}</span>
              <span class="modal__divider" aria-hidden="true">|</span>
              <span>${country}</span>
            </div>

            <div class="modal__overview-container">
              <h3 class="modal__subtitle">Overview</h3>
              <p class="modal__overview">${overview}</p>
            </div>

            <div class="modal__stats">
              <div class="stat">
                <span class="stat__label">Popularity</span>
                <span class="stat__value">${popularity}</span>
              </div>
              <div class="stat">
                <span class="stat__label">Vote Count</span>
                <span class="stat__value">${votes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this._parentElement.innerHTML = markup;
    this._open();
  }

  /**
   * The modal is invisible while closed, so the shared error overlay
   * would never show here. Errors open the dialog with a short message.
   */
  renderError(message = this._errorMessage) {
    this._parentElement.innerHTML = `
      <div
        class="modal__content modal__content--message"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button class="modal__close" type="button" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
        <div class="modal__body">
          <h2 class="modal__title" id="modal-title">${escapeHTML(message)}</h2>
        </div>
      </div>
    `;
    this._open();
  }

  _open() {
    // Remember where focus was so it can go back there on close
    if (!this._lastFocus) this._lastFocus = document.activeElement;

    this._parentElement.classList.add('modal--open');
    this._parentElement.removeAttribute('aria-hidden');

    // Page behind can't be clicked, tabbed into or read while open
    if (this._page) this._page.inert = true;
    document.documentElement.classList.add('is-modal-open');

    this._parentElement.querySelector('.modal__close')?.focus();
  }

  _isOpen() {
    return this._parentElement.classList.contains('modal--open');
  }

  close() {
    if (!this._isOpen()) return;

    this._parentElement.classList.remove('modal--open');
    this._parentElement.setAttribute('aria-hidden', 'true');

    if (this._page) this._page.inert = false;
    document.documentElement.classList.remove('is-modal-open');

    // Back to the card or button that opened it
    this._lastFocus?.focus?.({ preventScroll: true });
    this._lastFocus = null;

    this._onClose?.();
  }

  /**
   * Overlay click, the close button and Escape all close the dialog.
   * @param {Function} handler - Runs after closing (restores the tab title)
   */
  addHandlerClose(handler) {
    this._onClose = handler;

    this._parentElement.addEventListener('click', e => {
      const clickedOverlay = e.target === this._parentElement;
      const clickedClose = e.target.closest('.modal__close');

      if (clickedOverlay || clickedClose) this.close();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.close();
    });
  }

  handleDetailsClick(handler) {
    document.addEventListener('click', e => {
      // Cards (whole card) and the hero Details button
      const btn = e.target.closest('.js-details');
      if (!btn) return;

      const id = btn.dataset.id;
      const type = btn.dataset.type;
      if (!id || !type) return;

      // Remember the opener now: the spinner may take focus away
      this._lastFocus = btn;

      handler(type, id);
    });
  }
}

export default new DetailsView();
