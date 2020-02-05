import { browserHistory } from 'react-router';
// import axios from 'axios';
// import jwt from 'jsonwebtoken';

const userSignupRequest = userData => async () => {
    const serverResponse = await fetch('/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        xaccesstoken: localStorage.token
      },
      body: JSON.stringify(userData)
    }).catch((error) => {
      if (error.response) {
        return error.response.data.message;
        // Materialize.toast(error.response.data.message);
      } else {
        // notifyNetworkError(error);
        throw error;
      }
    });
    const jsonServerResponse = await serverResponse.json()
      .then(jsonData => jsonData);
    if (serverResponse.status === 201) {
      localStorage.setItem('token', jsonServerResponse.Token);
      browserHistory.push('/dashboard');
    } else {
      return serverResponse.message
    }
  };

  const reset = newPassword => ({
    pssw: newPassword
  })

  export {
    userSignupRequest,
    reset
  };