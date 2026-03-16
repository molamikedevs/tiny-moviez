export const createMovieCard = function (data) {
  const { poster_path, vote_average, release_date } = data;
  const IMG_URL = 'https://image.tmdb.org/t/p/w500';
  const title = data.title || data.name;

  return `
      <article class="movie-card">
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
            <button class="btn btn--details">Details</button>
          </div>
        </div>
      </article>
      `;
};
