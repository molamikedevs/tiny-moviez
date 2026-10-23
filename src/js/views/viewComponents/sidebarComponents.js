import icons from 'url:../../../img/icons.svg';
import noPosterImg from 'url:../../../img/no-poster.png';
import { escapeHTML } from '../../helpers';

const IMG_URL = 'https://image.tmdb.org/t/p/w185';

const imageOrFallback = path => (path ? IMG_URL + path : noPosterImg);

/**
 * Turns '2026-11-05' into 'NOV 5'.
 * new Date('2026-11-05') is read as UTC midnight, which shows the previous
 * day in timezones behind UTC, so the parts are passed in as local time.
 */
const formatReleaseDate = function (dateString) {
  if (!dateString) return 'TBA';

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const monthName = date
    .toLocaleString('default', { month: 'short' })
    .toUpperCase();

  return `${monthName} ${day}`;
};

export const createUpcomingItem = function (movie) {
  const title = escapeHTML(movie.title);

  return `
    <div class="upcoming__item" data-id="${movie.id}">
      <div class="upcoming__date">${formatReleaseDate(movie.release_date)}</div>
      <div class="upcoming__info">
        <h4 title="${title}">${title}</h4>
        <p>Upcoming Release</p>
      </div>
    </div>
  `;
};

export const createTheaterItem = function (movie) {
  const title = escapeHTML(movie.title);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';

  return `
    <div class="theaters__item" data-id="${movie.id}">
      <img src="${imageOrFallback(movie.poster_path)}" alt="" class="theaters__poster" loading="lazy" />
      <div class="theaters__info">
        <h4 title="${title}">${title}</h4>
        <div class="theaters__meta">
          <span><span aria-hidden="true">&#9733;</span> ${rating}</span>
        </div>
      </div>
    </div>
  `;
};

export const createActorItem = function (actor) {
  const name = escapeHTML(actor.name);

  // The titles of the 2 most famous things they are known for
  const knownFor = escapeHTML(
    (actor.known_for || [])
      .slice(0, 2)
      .map(item => item.title || item.name)
      .join(' • '),
  );

  // TMDB popularity is a score, not a chart position
  const popularity = actor.popularity ? Math.round(actor.popularity) : 'N/A';

  return `
    <div class="actor__item" data-id="${actor.id}">
      <img src="${imageOrFallback(actor.profile_path)}" alt="" class="actor__image" loading="lazy" />
      <div class="actor__info">
        <h4 title="${name}">${name}</h4>
        <p>${knownFor}</p>
        <div class="actor__trend">
          <svg class="trend__icon" aria-hidden="true"><use href="${icons}#icon-trending-up"></use></svg>
          <span>Popularity ${popularity}</span>
        </div>
      </div>
    </div>
  `;
};
