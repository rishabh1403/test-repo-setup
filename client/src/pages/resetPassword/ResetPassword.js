import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, Header, Message, Segment, Container } from 'semantic-ui-react';
import '../signin/signin.css';
import { Link } from 'react-router-dom';
import PasswordField from '../../components/common/InputFields/PasswordField';
import StyledButton from '../../components/common/styledButton/StyledButton';

import apiv1 from '../../utils/apiV1';

class ResetPassword extends Component {
  propTypes = {
    history: PropTypes.isRequired,
  };

  state = {
    password: '',
    confirmPassword: '',
  };

  handleFormSubmission = async event => {
    event.preventDefault();
    event.stopPropagation();
    const { password, confirmPassword } = this.state;
    if (password === confirmPassword) {
      try {
        const response = await apiv1.auth.post('/resetPassword', { password });
        const token = response && response.headers && response.headers['x-auth'];
        localStorage.setItem('authToken', token);
        const { history } = this.props;
        history.push('/');
        console.log(response);
      } catch (error) {
        console.log(error.response);
      }
    } else {
      alert("passwords don't match");
    }
  };

  onChange = event => {
    event.stopPropagation();
    const { name, value } = event.target;
    this.setState(() => ({ [name]: value }));
  };

  render() {
    const { password, confirmPassword } = this.state;
    return (
      <div className="login-form">
        <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              Reset Password
            </Header>
            <Form size="large" onSubmit={this.handleFormSubmission}>
              <Segment stacked>
                <PasswordField name="password" value={password} onChange={this.onChange} required />
                <PasswordField
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={this.onChange}
                  required
                  placeholder="Confirm Password"
                />
                <StyledButton text="Sign In" size="large" color="teal" fluid />
                <Container className="forgot-password-container" textAlign="right">
                  <Link to="/forgotPassword">Forgot Password?</Link>
                </Container>
              </Segment>
            </Form>
            <Message>
              New user?&nbsp;&nbsp;
              <Link to="/signup">Sign Up</Link>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default ResetPassword;
