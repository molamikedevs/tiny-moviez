import icons from 'url:../../../img/icons.svg';
import noPosterImg from 'url:../../../img/no-poster.png';
import { escapeHTML } from '../../helpers';
import { state } from '../../model';

const IMG_URL = 'https://image.tmdb.org/t/p/w500';

/**
 * Poster URL for a title, or the default poster when TMDB has none.
 * Exported so the controller can preload the same URLs the cards use.
 */
export const getPosterUrl = function (item) {
  return item.poster_path ? `${IMG_URL}${item.poster_path}` : noPosterImg;
};

export { noPosterImg };

export const createMovieCard = function (data) {
  const { vote_average, id, media_type } = data;
  const title = escapeHTML(data.title || data.name || 'Untitled');

  // Movies have release_date, series have first_air_date
  const year = (data.release_date || data.first_air_date || '').slice(0, 4);
  const rating = vote_average ? vote_average.toFixed(1) : 'NR';

  // Check if this specific movie's ID exists in the bookmarks array
  const isBookmarked = state.bookmarks.some(b => b.id === id);
  const bookmarkLabel = isBookmarked
    ? `Remove ${title} from bookmarks`
    : `Bookmark ${title}`;

  return `
      <article class="movie-card" data-id="${id}" data-type="${media_type}">
        <div class="movie-card__media">
          <img
            src="${getPosterUrl(data)}"
            class="movie-card__poster"
            alt=""
            width="500"
            height="750"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div class="movie-card__info">
          <h3 class="movie-card__title" title="${title}">${title}</h3>

          <div class="movie-card__meta">
            <span class="movie-card__rating">
              <span aria-hidden="true">&#9733;</span> ${rating}
            </span>
            <span class="movie-card__year">${year}</span>
          </div>
        </div>

        <button
          class="movie-card__open js-details"
          data-id="${id}"
          data-type="${media_type}"
          aria-label="View details for ${title}"
        ></button>

        <button
          class="movie-card__bookmark js-bookmark ${isBookmarked ? 'is-bookmarked' : ''}"
          data-id="${id}"
          data-type="${media_type}"
          aria-pressed="${isBookmarked}"
          aria-label="${bookmarkLabel}"
          title="${isBookmarked ? 'Remove bookmark' : 'Bookmark'}"
        >
          <svg aria-hidden="true"><use href="${icons}#icon-bookmarks"></use></svg>
        </button>
      </article>
      `;
};
