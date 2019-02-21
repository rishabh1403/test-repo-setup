import React from 'react';
import {
  Form, Grid, Header, Message, Segment,
} from 'semantic-ui-react';
import './forgotPassword.css';
import { Link } from 'react-router-dom';
import EmailField from '../../components/common/InputFields/EmailField';
import StyledButton from '../../components/common/styledButton/StyledButton';

const ForgotPassword = () => (
  <div className="password-reset-form">
    <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          Reset Password
        </Header>
        <Form size="large">
          <Segment stacked>
            <EmailField placeholder="Email" />
            <StyledButton text="Reset Password" size="large" color="teal" fluid />
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

export default ForgotPassword;
