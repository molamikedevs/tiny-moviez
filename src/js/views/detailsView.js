import View from './view';

class DetailsView extends View {
  _parentElement = document.querySelector('.modal');
  _errorMessage = 'Failed to load details';

  detailsRenderer(data) {
    const IMG = 'https://image.tmdb.org/t/p/w500';
    const title = data.title || data.name;

    const date = data.release_date || data.first_air_date || '';
    const year = date ? date.slice(0, 4) : 'N/A';
    const country =
      data.origin_country && data.origin_country.length > 0
        ? data.origin_country[0]
        : 'N/A';

    const rating = data.vote_average ? data.vote_average.toFixed(1) : 'N/A';
    const votes = data.vote_count ? data.vote_count.toLocaleString() : 'N/A';
    const popularity = data.popularity ? Math.round(data.popularity) : 'N/A';

    const markup = `
      <div class="modal__content">
        <button class="modal__close">×</button>

        <img class="modal__poster" src="${data.poster_path ? IMG + data.poster_path : ''}" alt="${title}" />

        <div class="modal__info">
          <h2 class="modal__title">${title}</h2>

          <div class="modal__meta">
            <span class="modal__rating">⭐ ${rating}</span>
            <span class="modal__divider">|</span>
            <span>${year}</span>
            <span class="modal__divider">|</span>
            <span>${country}</span>
          </div>

          <div class="modal__overview-container">
            <h3 class="modal__subtitle">Overview</h3>
            <p class="modal__overview">
              ${data.overview || 'No overview available for this title.'}
            </p>
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
    `;

    this._parentElement.innerHTML = markup;
    this._parentElement.classList.add('modal--open');
  }

  close() {
    this._parentElement.classList.remove('modal--open');
  }

  addHandlerClose() {
    this._parentElement.addEventListener('click', e => {
      if (
        e.target.classList.contains('modal') ||
        e.target.classList.contains('modal__close')
      ) {
        this.close();
      }
    });
  }

  handleDetailsClick(handler) {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.btn--details');
      if (!btn) return;

      const id = btn.dataset.id;
      const type = btn.dataset.type;
      if (!id || !type) return;
      console.log({ Type: type, ID: id });

      handler(type, id);
    });
  }
}

export default new DetailsView();
