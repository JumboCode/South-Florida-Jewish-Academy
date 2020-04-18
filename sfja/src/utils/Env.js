// eslint-disable-next-line require-jsdoc
function apiUrl() {
  return process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://api-sfjaforms.herokuapp.com';
}

export default apiUrl;
