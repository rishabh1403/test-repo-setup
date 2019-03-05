import React from 'react';
import {
  Form, Grid, Header, Message, Segment, Container,
} from 'semantic-ui-react';
import './signin.css';
import { Link } from 'react-router-dom';
import InputField from '../../components/common/InputFields/InputField';
import PasswordField from '../../components/common/InputFields/PasswordField';
import StyledButton from '../../components/common/styledButton/StyledButton';

const SignIn = () => (
  <div className="login-form">
    <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
      <Grid.Column style={{ width: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          Sign In
        </Header>
        <Form size="large">
          <Segment stacked>
            <InputField fluid icon="user" iconPosition="left" placeholder="Username" />
            <PasswordField placeholder="Password" />
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

export default SignIn;
