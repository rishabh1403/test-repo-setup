import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

class ResetPasswordWithToken extends Component {
  propTypes = {
    match: PropTypes.isRequired,
  };

  componentDidMount() {
    this.saveTokenAndRedirect();
  }

  saveTokenAndRedirect = () => {
    try {
      const { match } = this.props;
      const { token } = match.params;
      localStorage.setItem('authToken', token);
    } catch (error) {
      console.log('Some Error');
      console.log(error.response);
    }
  };

  render() {
    return <Redirect to="/resetPassword" />;
  }
}

export default ResetPasswordWithToken;
