import React from 'react';
import {
  Form, Grid, Header, Message, Segment,
} from 'semantic-ui-react';
import './signup.css';
import { Link } from 'react-router-dom';
import EmailField from '../../components/common/InputFields/EmailField';
import PasswordField from '../../components/common/InputFields/PasswordField';
import StyledButton from '../../components/common/styledButton/StyledButton';
import InputField from '../../components/common/InputFields/InputField';

const SignUp = () => (
  <div className="signup-form">
    <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
      <Grid.Column style={{ width: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          Sign Up
        </Header>
        <Form size="large">
          <Segment stacked>
            <EmailField placeholder="Email" />
            <EmailField placeholder="Confirm Email" />
            <InputField fluid icon="user" iconPosition="left" placeholder="Username" />
            <PasswordField placeholder="Password" />
            <PasswordField placeholder="Confirm Password" />
            <StyledButton text="Sign Up" size="large" color="teal" fluid />
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

export default SignUp;
