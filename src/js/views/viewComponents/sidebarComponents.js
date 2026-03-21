import icons from 'url:../../../img/icons.svg';

const IMG_URL = 'https://image.tmdb.org/t/p/w185';

export const createUpcomingItem = function (movie) {
  const date = new Date(movie.release_date);
  const month = date
    .toLocaleString('default', { month: 'short' })
    .toUpperCase();
  const day = date.getDate();

  return `
    <div class="upcoming__item" data-id="${movie.id}">
      <div class="upcoming__date">${month} ${day}</div>
      <div class="upcoming__info">
        <h4>${movie.title}</h4>
        <p>Upcoming Release</p>
      </div>
      <button class="upcoming__reminder" title="Remind me">
        <svg><use href="${icons}#icon-bell"></use></svg>
      </button>
    </div>
  `;
};

export const createTheaterItem = function (movie) {
  // TMDB doesn't return showtimes natively,
  return `
    <div class="theaters__item" data-id="${movie.id}">
      <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}" class="theaters__poster" />
      <div class="theaters__info">
        <h4>${movie.title}</h4>
        <div class="theaters__meta">
          <span>⭐ ${movie.vote_average.toFixed(1)}</span>
        </div>
        <div class="theaters__showtimes">
          <span class="showtime">11:30 AM</span>
          <span class="showtime">2:45 PM</span>
          <span class="showtime">7:00 PM</span>
        </div>
      </div>
      <button class="theaters__ticket" title="Get Tickets">
        <svg><use href="${icons}#icon-ticket"></use></svg>
      </button>
    </div>
  `;
};

export const createActorItem = function (actor) {
  // Grab the titles of the 2 most famous things they are known for
  const knownFor = actor.known_for
    .slice(0, 2)
    .map(item => item.title || item.name)
    .join(' • ');

  return `
    <div class="actor__item" data-id="${actor.id}">
      <img src="${IMG_URL + actor.profile_path}" alt="${actor.name}" class="actor__image" />
      <div class="actor__info">
        <h4>${actor.name}</h4>
        <p>${knownFor}</p>
        <div class="actor__trend">
          <svg class="trend__icon"><use href="${icons}#icon-trending-up"></use></svg>
          <span>Trending #${actor.popularity.toFixed(0)}</span>
        </div>
      </div>
    </div>
  `;
};
