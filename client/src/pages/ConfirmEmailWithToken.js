import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import apiv1 from '../utils/apiV1';

class ConfirmEmailWithToken extends Component {
  propTypes = {
    match: PropTypes.isRequired,
  };

  componentDidMount() {
    this.verifyUser();
  }

  verifyUser = async () => {
    try {
      const { match } = this.props;
      const { token } = match.params;
      await apiv1.noAuth.post('/activateUser', { token });
    } catch (error) {
      console.log(error.response);
    }
  };

  render() {
    return <Redirect to="/" />;
  }
}

export default ConfirmEmailWithToken;
