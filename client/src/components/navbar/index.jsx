import React from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends React.Component {
    // constructor(props) {
    //     super(props);
    //     };
    render() {
        return (
            <div>
              <nav className="navbar navbar-expand-lg navbar-light bg-light navbar-fixed">
                  <div className="container">
                  <Link className="navbar-brand" to="#">Amir</Link>
                  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon"></span>
                  </button>
                  <div className="collapse navbar-collapse" id="navbarNav">
                      <ul className="navbar-nav">
                      <li className="nav-item active">
                          <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                      </li>
                      <li className="nav-item">
                          <Link className="nav-link" to="/contact">Contact Us</Link>
                      </li>
                      <li className="nav-item">
                          <Link className="nav-link" to={this.props.link1}>{this.props.value1}</Link>
                      </li>
                      <li className="nav-item">
                          <Link className="nav-link" to={this.props.link2}>{this.props.value2}</Link>
                      </li>
                      </ul>
                  </div>
                  </div>
                  </nav>
            </div>
          )
    }
}