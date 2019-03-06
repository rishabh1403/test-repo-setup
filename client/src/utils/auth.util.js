import React, { Component } from 'react';
import PropTypes from 'prop-types';

const Auth = (isAuth = true) => ChildComponent => {
  class ComposedComponent extends Component {
    static propTypes = {
      history: PropTypes.isRequired,
    };

    componentDidMount() {
      return isAuth ? this.navigateAwayForAuth() : this.navigateAwayForNoAuth();
    }

    componentDidUpdate() {
      return isAuth ? this.navigateAwayForAuth() : this.navigateAwayForNoAuth();
    }

    navigateAwayForAuth = () => {
      const { history } = this.props;
      if (!localStorage.getItem('authToken')) {
        history.push('/');
      }
    };

    navigateAwayForNoAuth = () => {
      const { history } = this.props;
      if (localStorage.getItem('authToken')) {
        history.push('/dashboard');
      }
    };

    render() {
      return <ChildComponent {...this.props} />;
    }
  }

  return ComposedComponent;
};

export const requireAuth = Auth();
export const requireNoAuth = Auth(false);
