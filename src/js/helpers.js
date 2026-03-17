import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long after ${s} seconds`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, api) {
  try {
    const fetchRequest = await fetch(url, {
      headers: {
        Authorization: `Bearer ${api}`,
        'Content-Type': 'application/json',
      },
    });

    const res = await Promise.race([fetchRequest, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.status_message} (${res.status})`);

    return data;
  } catch (error) {
    throw error;
  }
};

export const debounce = function (fn, delay = 400) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
