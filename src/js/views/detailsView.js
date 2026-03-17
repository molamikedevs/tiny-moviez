import View from './view';

class DetailsView extends View {
  _parentElement = document.querySelector('.modal');

  render(data) {
    const IMG = 'https://image.tmdb.org/t/p/original';

    const title = data.title || data.name;

    const markup = `
      <div class="modal__content">

        <button class="modal__close">×</button>

        <img class="modal__poster" src="${IMG + data.poster_path}" />

        <div class="modal__info">
          <h2>${title}</h2>

          <p class="modal__rating">
            ⭐ ${data.vote_average}
          </p>

          <p class="modal__overview">
            ${data.overview}
          </p>

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
}

export default new DetailsView();
