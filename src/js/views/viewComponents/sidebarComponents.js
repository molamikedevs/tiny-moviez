import icons from 'url:../../../img/icons.svg';
import noPosterImg from 'url:../../../img/no-poster.png';
import { escapeHTML } from '../../helpers';

const IMG_URL = 'https://image.tmdb.org/t/p/w185';

const imageOrFallback = path => (path ? IMG_URL + path : noPosterImg);

export const createUpcomingItem = function (movie) {
  const date = new Date(movie.release_date);
  const month = date
    .toLocaleString('default', { month: 'short' })
    .toUpperCase();
  const day = date.getDate();
  const title = escapeHTML(movie.title);

  return `
    <div class="upcoming__item" data-id="${movie.id}">
      <div class="upcoming__date">${month} ${day}</div>
      <div class="upcoming__info">
        <h4 title="${title}">${title}</h4>
        <p>Upcoming Release</p>
      </div>
      <button class="upcoming__reminder" title="Remind me" aria-label="Remind me about ${title}">
        <svg aria-hidden="true"><use href="${icons}#icon-bell"></use></svg>
      </button>
    </div>
  `;
};

export const createTheaterItem = function (movie) {
  const title = escapeHTML(movie.title);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';

  // TMDB doesn't return showtimes natively,
  return `
    <div class="theaters__item" data-id="${movie.id}">
      <img src="${imageOrFallback(movie.poster_path)}" alt="" class="theaters__poster" loading="lazy" />
      <div class="theaters__info">
        <h4 title="${title}">${title}</h4>
        <div class="theaters__meta">
          <span><span aria-hidden="true">&#9733;</span> ${rating}</span>
        </div>
        <div class="theaters__showtimes">
          <span class="showtime">11:30 AM</span>
          <span class="showtime">2:45 PM</span>
          <span class="showtime">7:00 PM</span>
        </div>
      </div>
      <button class="theaters__ticket" title="Get Tickets" aria-label="Get tickets for ${title}">
        <svg aria-hidden="true"><use href="${icons}#icon-ticket"></use></svg>
      </button>
    </div>
  `;
};

export const createActorItem = function (actor) {
  const name = escapeHTML(actor.name);

  // Grab the titles of the 2 most famous things they are known for
  const knownFor = escapeHTML(
    (actor.known_for || [])
      .slice(0, 2)
      .map(item => item.title || item.name)
      .join(' • '),
  );

  return `
    <div class="actor__item" data-id="${actor.id}">
      <img src="${imageOrFallback(actor.profile_path)}" alt="" class="actor__image" loading="lazy" />
      <div class="actor__info">
        <h4 title="${name}">${name}</h4>
        <p>${knownFor}</p>
        <div class="actor__trend">
          <svg class="trend__icon" aria-hidden="true"><use href="${icons}#icon-trending-up"></use></svg>
          <span>Trending #${actor.popularity.toFixed(0)}</span>
        </div>
      </div>
    </div>
  `;
};
