import auth0 from 'auth0-js';


class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      // the following three lines MUST be updated
      domain: 'sfja.auth0.com',
      audience: 'https://api.sfjaadmin.org',
      clientID: '9HXnU45l0cn7eY1z02NGoGy5cWbiBxRQ',
      redirectUri: 'http://localhost:3000/callback',
      responseType: 'token',
      scope: 'openid profile',
    });
    this.getProfile = this.getProfile.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  getProfile() {
    return this.profile;
  }

  getToken() {
    return this.token;
  }

  getCallbackURL() {
    console.log(this)
    return this.callback;
  }

  isAuthenticated() {
    return true;
    // return new Date().getTime() < this.expiresAt;
  }

  signIn() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        console.log(authResult)
        if (err) return reject(err);
        if (!authResult || !authResult.accessToken) {
          return reject(err);
        }
        this.token = authResult.accessToken;
        // this.profile = authResult.idTokenPayload;
        // set the time that the id token will expire at
        this.expiresAt = authResult.expiresIn * 1000;
        resolve();
      });
    });
  }

  signOut() {
    // clear id token, profile, and expiration
    this.accessToken = null;
    this.expiresAt = null;
  }
}

const auth0Client = new Auth();

export default auth0Client;
