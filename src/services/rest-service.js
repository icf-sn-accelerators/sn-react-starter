import axios from 'axios';

const instance = axios.create();

if (process.env.NODE_ENV === 'development') {
  const username = process.env.SERVICENOW_USERNAME;
  const password = process.env.SERVICENOW_PASSWORD;

  instance.defaults.auth = { username, password };
} else {
  instance.defaults.headers['X-userToken'] = window.serviceNowUserToken;
}

export default instance;
