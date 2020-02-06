import React from 'react';
import {browserHistory} from 'react-router';
import utils from '../../utils/utils';

function RequireAdmin(ComposedComponent){

  class Authenticated extends React.Component {

    componentWillMount(){
        const token = localStorage.getItem("token");
        utils.verifyToken(token)
        .then((logged) => {
            console.log(logged, "logged")
          if (!logged){
            browserHistory.push("/signin")
          }
        });
    }
    componentWillUpdate(nextProps) {
        console.log(nextProps, 'nextprops')
        utils.verifyToken(localStorage.getItem("token"))
        .then((logged) => {
          if (!logged){
            browserHistory.push("/signin")
          }
        });
      }

    render(){
      return <ComposedComponent />;
    }
  }
  //Return the new Component that requires authorization
  return Authenticated;
}
export default RequireAdmin;