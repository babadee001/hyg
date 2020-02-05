import React from 'react';
import toastr from 'toastr'
import { Link, withRouter } from 'react-router-dom';
import Navbar from '../../navbar';


class SigninForm extends React.Component{
    constructor(props){
        super(props);
        this.state= {
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
        const { password, email } = this.state
        const response = await fetch('/signin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password, email
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
    }
    render() {
        return(
            <div>
                <Navbar link1='/signup' value1='Sign up' />
                <div className="mainsignin">
                <p className="sign" align="center">Signin</p>
                <form className="form1" onSubmit={ this.onSubmit }>
                <p className="errormessage">{this.state.errorMessage}</p>
                <input className="un" type="email" align="center" placeholder="Email" name="email" value={this.state.email} onChange={ this.onChange } required></input>
                <input className="pass" type="password" align="center" placeholder="Password" value={this.state.password} onChange={ this.onChange } name="password" required></input>
                <button type="submit" className="submit" align="center">Sigin</button>
                <p className="forgot" align="center">Forgot password?<Link to="/reset"> Reset</Link></p>
                </form>
                </div>
            </div>
        )
    }
}
export default withRouter(SigninForm)