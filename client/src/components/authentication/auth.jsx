import React from 'react';
// import {browserHistory} from 'react-router';
// import utils from '../../utils/utils';

function RequireAdmin(ComposedComponent){

  class Authenticated extends React.Component {

    render(){
      return <ComposedComponent />;
    }
  }
  //Return the new Component that requires authorization
  return Authenticated;
}
export default RequireAdmin;