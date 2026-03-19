import icons from '../../../img/icons.svg';

export const createMovieCard = function (data) {
  const { poster_path, vote_average, release_date, id, media_type } = data;
  const IMG_URL = 'https://image.tmdb.org/t/p/w500';
  const title = data.title || data.name;

  return `
      <article class="movie-card" data-id="${id}" data-type="${media_type}">
        <img
          src="${IMG_URL + poster_path}"
          class="movie-card__poster"
          alt="${title}"
        />

        <div class="movie-card__info">
          <h3 class="movie-card__title">${title}</h3>

          <div class="movie-card__meta">
            <span>${vote_average.toFixed(1)} ⭐</span>
            <span>${release_date?.slice(0, 4) || ''}</span>
          </div>

          <div class="movie-card__actions">
            <button class="btn btn--details" data-id="${id}" data-type="${media_type}">Details</button>

            <button class="btn btn--bookmark" data-id="${id}" data-type="${media_type}" title="Add to Bookmarks">
              <svg class="btn__icon">
                <use href="${icons}#icon-bookmark"></use>
              </svg>
            </button>
          </div>
        </div>
      </article>
      `;
};
