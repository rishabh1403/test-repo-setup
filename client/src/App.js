import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Page404 from './pages/404/Page404';
import Home from './pages/home/Home';
import ConfirmEmailWithToken from './pages/ConfirmEmailWithToken';
import ResetPasswordWithToken from './pages/ResetPasswordWithToken';
import SignIn from './pages/signin/Signin';
import SignUp from './pages/signup/SignUp';
import ResetPassword from './pages/resetPassword/ResetPassword';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import Header from './components/common/header/Header';
import Dashboard from './pages/dashboard/Dashboard';
import LeaderboardPage from './pages/leaderboard/Leaderboard';
import { requireAuth, requireNoAuth } from './utils/auth.util';

const App = () => (
  <BrowserRouter>
    <Header>
      <Switch>
        <Route exact path="/" component={requireNoAuth(Home)} />
        <Route exact path="/emailVerification/token/:token" component={ConfirmEmailWithToken} />
        <Route exact path="/resetPassword/token/:token" component={ResetPasswordWithToken} />
        <Route exact path="/signin" component={requireNoAuth(SignIn)} />
        <Route exact path="/signup" component={requireNoAuth(SignUp)} />
        <Route exact path="/forgotPassword" component={requireNoAuth(ForgotPassword)} />
        <Route exact path="/resetPassword" component={requireAuth(ResetPassword)} />
        <Route exact path="/dashboard" component={requireAuth(Dashboard)} />
        <Route exact path="/leaderboard" component={requireAuth(LeaderboardPage)} />
        <Route exact path="*" component={Page404} />
      </Switch>
    </Header>
  </BrowserRouter>
);

export default App;
