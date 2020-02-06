import React, { Component } from 'react';
import SigninForm from '../forms/signin/signin';
import './signin.scss';

export default class Signup extends Component {

  render() {
    localStorage.removeItem('token');
    return (
      <div>
       <SigninForm
       />
      </div>
  )
}
}
