import React from 'react';
import toastr from 'toastr'
import { withRouter } from 'react-router-dom';
import Navbar from '../../navbar'
import './style.scss'


class resetForm extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            securityAnswer: '',
            securityQuestion: '',
            newPassword: '',
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
        const { securityAnswer, newPassword, securityQuestion, email } = this.state
        const response = await fetch('/reset', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                securityAnswer, newPassword, securityQuestion, email
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
            if (jsonServerResponse.status === 201) {
                toastr.info(jsonServerResponse.message)
                this.props.history.push('/signin')
              } else {
                this.setState({
                    errorMessage: jsonServerResponse.message.message || jsonServerResponse.message
                })
              }
    }
    render() {
        return(
            <div>
                <Navbar link1='/signup' value1='Sign up' link2='/signin' value2='Sign in' />
                    <div className="mainreset">
                    <p className="sign" align="center">Reset Password</p>
                    <form className="form1" onSubmit={ this.onSubmit }>
                    <p className="errormessage">{this.state.errorMessage}</p>
                    <input className="un" type="email" align="center" placeholder="Email" name="email" value={this.state.email} onChange={ this.onChange } required></input>
                    <select className="un" value={this.state.securityQuestion} onChange={ this.onChange } name="securityQuestion" required>
                        <option align="center">Select your security question</option>
                        <option>My first crush</option>
                        <option>Name of my first Dog</option>
                        <option>My mother's maiden name</option>
                        <option>Street I grew up</option>
                    </select>
                    <input className="un" type="password" align="center" placeholder="Security Answer" value={this.state.securityAnswer} onChange={ this.onChange } name="securityAnswer" required></input>
                    <input className="pass" type="password" align="center" placeholder="New Password" value={this.state.newPassword} onChange={ this.onChange } name="newPassword" required></input>
                    <button type="submit" className="submit" align="center">Reset</button>
                    </form>
                    </div>
            </div>
        )
    }
}
export default withRouter(resetForm)
// SignupForm.propTypes = {
//     signupRequest: React.PropTypes.func.isRequired,
// }

// SignupForm.contextTypes = {
//     router: React.PropTypes.object.isRequired,
//   };