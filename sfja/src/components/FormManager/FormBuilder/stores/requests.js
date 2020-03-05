import fetch from 'isomorphic-fetch';

const headers = {
  // eslint-disable-next-line quote-props
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  // eslint-disable-next-line quote-props
  OPTIONS: '',
};

// eslint-disable-next-line require-jsdoc
export function post(url, data) {
  return fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({data: data}),
    // eslint-disable-next-line arrow-parens
  }).then(response => response);
}

// eslint-disable-next-line require-jsdoc
export function get(url) {
  return fetch(url, {
    method: 'GET',
    headers,
    // eslint-disable-next-line arrow-parens
  }).then(response => response.json());
}
