import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Signup from './components/signup/signup';
import Signin from './components/signin/signin';
import Contact from './components/contact';
import Reset from './components/resetPassword/index';
// import Navbar from './components/navbar';
import Data from './components/data';

class App extends Component {
 
  render() {
    return (
        <Router>
          <div className="App">
            {/* <Navbar /> */}
              <Route exact path='/' component={Signup} />
              <Route path='/signup' component={Signup} />
              <Route path='/signin' component={Signin} />
              <Route path='/contact' component={Contact} />
              <Route path='/reset' component={Reset} />
              <Route path='/data' component={Data} />
        </div>
        </Router>
    );
  }
}

export default App;
