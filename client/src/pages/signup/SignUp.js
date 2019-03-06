import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import EmailField from '../../components/common/InputFields/EmailField';
import PasswordField from '../../components/common/InputFields/PasswordField';
import StyledButton from '../../components/common/styledButton/StyledButton';
import InputField from '../../components/common/InputFields/InputField';
import apiv1 from '../../utils/apiV1';
import './signup.css';

class SignUp extends Component {
  propTypes = {
    history: PropTypes.isRequired,
  };

  state = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  handleFormSubmission = async event => {
    event.preventDefault();
    event.stopPropagation();
    const { name, email, password, confirmPassword } = this.state;
    if (password === confirmPassword) {
      try {
        const response = await apiv1.noAuth.post('/signup', {
          name,
          email,
          password,
        });
        if (response.status === 201) {
          const { history } = this.props;
          history.push('/');
        }
        console.log(response);
      } catch (error) {
        console.log(error.response);
      }
    }
  };

  onChange = event => {
    event.stopPropagation();
    const { name, value } = event.target;
    this.setState(() => ({ [name]: value }));
  };

  render() {
    const { name, email, password, confirmPassword } = this.state;
    return (
      <div className="signup-form">
        <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
          <Grid.Column style={{ width: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              Sign Up
            </Header>
            <Form size="large" onSubmit={this.handleFormSubmission}>
              <Segment stacked>
                <InputField
                  name="name"
                  value={name}
                  onChange={this.onChange}
                  placeholder="Name"
                  required
                  fluid
                  icon="user"
                  iconPosition="left"
                />
                <EmailField name="email" value={email} onChange={this.onChange} required />
                <PasswordField
                  name="password"
                  value={password}
                  onChange={this.onChange}
                  required
                  minLength={6}
                />
                <PasswordField
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={this.onChange}
                  required
                  minLength={6}
                  placeholder="Confirm Password"
                />
                <StyledButton text="Submit" size="large" color="teal" fluid />
              </Segment>
            </Form>
            <Message>
              Already an user?&nbsp;&nbsp;
              <Link to="/signin">Sign In</Link>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default SignUp;
