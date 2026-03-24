import icons from 'url:../../img/icons.svg';

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

    // Optional: Auto remove after 5 seconds
    setTimeout(() => {
      const errorElement = this._parentElement.querySelector('.error');
      if (errorElement) {
        errorElement.remove();
      }
    }, 6000);
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

  // Optional: Show inline error for smaller containers
  renderInlineError(message = this._errorMessage) {
    const markup = `
      <div class="error-inline">
        <svg class="error-inline__icon">
          <use href="${icons}#icon-warning"></use>
        </svg>
        <p>${message}</p>
        <button onclick="this.closest('.error-inline').remove()">Retry</button>
      </div>
    `;

    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Show loading skeleton
  renderSkeleton() {
    const markup = `
      <div class="skeleton-grid">
        ${Array(8)
          .fill(
            `
          <div class="skeleton movie-card-skeleton">
            <div class="skeleton skeleton-poster"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-meta"></div>
          </div>
        `,
          )
          .join('')}
      </div>
    `;

    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
