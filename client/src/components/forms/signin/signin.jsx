import React from 'react';
import toastr from 'toastr'
import { Link, withRouter } from 'react-router-dom';
// import '../signin/style.scss';


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
        console.log(password, email)
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
                this.props.history.push('/data')
                // const decoded = jwt.decode(jsonServerResponse.Token);
              } else {
                this.setState({
                    errorMessage: jsonServerResponse.message.message || jsonServerResponse.message
                })
              }
              console.log(jsonServerResponse)
    }
    render() {
        return(
            <div className="main">
              <p className="sign" align="center">Signup</p>
              <form className="form1" onSubmit={ this.onSubmit }>
              <p className="errormessage">{this.state.errorMessage}</p>
              <input className="un" type="email" align="center" placeholder="Email" name="email" value={this.state.email} onChange={ this.onChange } required></input>
              <input className="pass" type="password" align="center" placeholder="Password" value={this.state.password} onChange={ this.onChange } name="password" required></input>
              <button type="submit" className="submit" align="center">Sigin</button>
              <p className="forgot" align="center">Forgot password?<Link to="/reset"> Reset</Link></p>
              </form>
            </div>
        )
    }
}
export default withRouter(SigninForm)