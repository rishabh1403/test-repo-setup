import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import EmailField from '../../components/common/InputFields/EmailField';
import StyledButton from '../../components/common/styledButton/StyledButton';
import apiv1 from '../../utils/apiV1';
import './forgotPassword.css';

class ForgotPassword extends Component {
  propTypes = {
    history: PropTypes.isRequired,
  };

  state = {
    email: '',
  };

  handleFormSubmission = async event => {
    event.preventDefault();
    event.stopPropagation();
    const { email } = this.state;
    try {
      const response = await apiv1.noAuth.post('/forgetPassword', { email });
      const token = response && response.headers && response.headers['x-auth'];
      localStorage.setItem('authToken', token);
      const { history } = this.props;
      history.push('/');
      console.log(response);
    } catch (error) {
      console.log(error.response);
    }
  };

  onChange = event => {
    event.stopPropagation();
    const { name, value } = event.target;
    this.setState(() => ({ [name]: value }));
  };

  render() {
    const { email } = this.state;
    return (
      <div className="password-reset-form">
        <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
          <Grid.Column style={{ width: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              Forget Password ?
            </Header>
            <Form size="large" onSubmit={this.handleFormSubmission}>
              <Segment stacked>
                <EmailField name="email" value={email} onChange={this.onChange} required />
                <StyledButton text="Submit" size="large" color="teal" fluid />
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

export default ForgotPassword;
