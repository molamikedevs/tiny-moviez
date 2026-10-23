import icons from 'url:../../img/icons.svg';
import { escapeHTML } from '../helpers';

export default class View {
  _data;

  /**
   * Template method: every child view renders through here.
   * The child only supplies _parentElement and _generateMarkup().
   */
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Messages can contain user input (the search query), so escape them
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <svg class="error__icon">
          <use href="${icons}#icon-warning"></use>
        </svg>
        <p>${escapeHTML(message)}</p>
        <button class="error__btn" onclick="this.closest('.error').remove()">
          <svg>
            <use href="${icons}#icon-cross"></use>
          </svg>
          Dismiss
        </button>
      </div>
    `;

    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg class="spinner__icon">
          <use href="${icons}#icon-spinner"></use>
        </svg>
      </div>
    `;

    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  clear() {
    this._parentElement.innerHTML = '';
  }
}
