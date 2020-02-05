import React from 'react';
import toastr from 'toastr'
import { Link, withRouter } from 'react-router-dom';
import './signup.scss';
import Navbar from '../../navbar';


class SignupForm extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            username: '',
            securityAnswer: '',
            securityQuestion: '',
            password: '',
            email: '',
            errorMessage: ''
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    onSubmit = async event => {
        event.preventDefault();
        const { username, securityAnswer, password, securityQuestion, email } = this.state
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username, securityAnswer, password, securityQuestion, email
            }),
          }).catch((error) => {
            if (error.response) {
                this.setState({
                    errorMessage: error.response.data.message
                })
            } else {
              throw error;
            }
          });
          const jsonServerResponse = await response.json()
            .then(jsonData => jsonData);
            if (jsonServerResponse.Token) {
                localStorage.setItem('token', jsonServerResponse.Token);
                toastr.info(jsonServerResponse.message)
                this.props.history.push('/dashboard')
                // const decoded = jwt.decode(jsonServerResponse.Token);
              } else {
                this.setState({
                    errorMessage: jsonServerResponse.message.message || jsonServerResponse.message
                })
              }
        // this.props.userSignupRequest(this.state)
    }
    render() {
        return(
            <div>
                <Navbar link1='/signin' value1='Sign in' />
                <div className="main">
                <p className="sign" align="center">Signup</p>
                <form className="form1" onSubmit={ this.onSubmit }>
                <p className="errormessage">{this.state.errorMessage}</p>
                <input className="un" type="text" align="center" placeholder="Username" value={this.state.username} onChange={ this.onChange } name="username" required></input>
                <input className="un" type="email" align="center" placeholder="Email" name="email" value={this.state.email} onChange={ this.onChange } required></input>
                <select className="un" value={this.state.question} onChange={ this.onChange } name="securityQuestion" required>
                    <option align="center">Select your security question</option>
                    <option>My first crush</option>
                    <option>Name of my first Dog</option>
                    <option>My mother's maiden name</option>
                    <option>Street I grew up</option>
                </select>
                <input className="un" type="password" align="center" placeholder="Security Answer" value={this.state.answer} onChange={ this.onChange } name="securityAnswer" required></input>
                <input className="pass" type="password" align="center" placeholder="Password" value={this.state.password} onChange={ this.onChange } name="password" required></input>
                {/* <input className="pass" type="password" align="center" placeholder="Confirm Password" name="cpassword"></input> */}
                <button type="submit" className="submit" align="center">Signup</button>
                <p className="forgot" align="center">Have an account?<Link to="/signin"> Signin</Link></p>
                </form>
                </div>
            </div>
        )
    }
}
export default withRouter(SignupForm)
// SignupForm.propTypes = {
//     signupRequest: React.PropTypes.func.isRequired,
// }

// SignupForm.contextTypes = {
//     router: React.PropTypes.object.isRequired,
//   };