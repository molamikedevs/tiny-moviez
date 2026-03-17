import icons from '../../img/icons.svg';

export default class View {
  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <svg class="error__icon">
        <use href="${icons}#icon-warning"></use>
      </svg>
      <p>${message}</p>
    </div>
  `;

    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  clear() {
    this._parentElement.innerHTML = '';
  }

  spinner() {
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
}
