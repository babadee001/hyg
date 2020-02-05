import React from 'react';
import './style.scss';
import Navbar from '../navbar';

export default function About(){
    return (
      <div>
        <Navbar />
        <div className="maincontact">
          <p className="sign" align="center">Write To Us</p>
          <form className="form1" action="mailto:amiramara11@gmail.com">
          <input className="pass" type="text" align="center" placeholder="Name"></input>
          <input className="un" type="email" align="center" placeholder="Email"></input>
          <label  className="labelcontact" for="contactus">Tell us what you think, we will get back to you:</label>
          <textarea className="un" rows="5" cols="33"></textarea>
            <div className="btn-group group">
              <button className="submitcontact" align="center" type="button">Submit</button>
              <button className="submitcontact" align="center" type="submit">mail</button>
            </div>
          </form>
        </div>
      </div>
    )
}