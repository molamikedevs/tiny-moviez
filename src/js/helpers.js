import { TIMEOUT_SEC, TMDB_BASE_URL } from './config';

// A promise that only ever rejects, after s seconds (used in the race below)
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long after ${s} seconds`));
    }, s * 1000);
  });
};

/**
 * Builds every TMDB URL in the app.
 * include_adult=false is set last, so no caller can switch it back on.
 * @param {string} path - Endpoint path, e.g. '/movie/popular'
 * @param {Object} params - Extra query parameters
 * @returns {string} The full request URL
 */
export const buildTmdbUrl = function (path, params = {}) {
  const url = new URL(`${TMDB_BASE_URL}${path}`);

  Object.entries({ ...params, include_adult: false }).forEach(([key, value]) =>
    url.searchParams.set(key, value),
  );

  return url.toString();
};

/**
 * Makes API text safe to place inside HTML and attributes.
 * Titles like `Tom & Jerry` or `"Weird" Al` would otherwise break markup.
 * @param {string} value
 * @returns {string}
 */
export const escapeHTML = function (value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Waits for images to download and decode, up to a time limit.
 * Never rejects: a broken or slow image must not block the page.
 * @param {string[]} urls - Image URLs to warm up
 * @param {number} maxMs - Give up waiting after this long
 * @returns {Promise<void>}
 */
export const preloadImages = function (urls, maxMs = 3000) {
  const loads = urls.filter(Boolean).map(src => {
    const img = new Image();
    img.src = src;
    return img.decode().catch(() => {});
  });

  const limit = new Promise(resolve => setTimeout(resolve, maxMs));

  return Promise.race([Promise.all(loads), limit]);
};

/**
 * Fetches JSON from TMDB with a time limit.
 * Throws on a timeout or a non-OK response; the controller shows the error.
 */
export const AJAX = async function (url, api) {
  // No await here: start the request and pass the pending promise
  // into the race, so the timeout can actually win
  const fetchRequest = fetch(url, {
    headers: {
      Authorization: `Bearer ${api}`,
      'Content-Type': 'application/json',
    },
  });

  const res = await Promise.race([fetchRequest, timeout(TIMEOUT_SEC)]);
  const data = await res.json();

  // fetch only rejects on network failure, so check the status ourselves
  if (!res.ok) throw new Error(`${data.status_message} (${res.status})`);

  return data;
};
