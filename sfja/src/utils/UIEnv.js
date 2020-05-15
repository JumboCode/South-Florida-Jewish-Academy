// eslint-disable-next-line require-jsdoc
function uiUrl() {
  return process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://sfjaforms.herokuapp.com';
}

export default uiUrl;
