import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Page404 from './pages/404/Page404';
import Home from './pages/home/Home';
import SignIn from './pages/signin/Signin';
import SignUp from './pages/signup/SignUp';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import Header from './components/common/header/Header';
import LeaderboardPage from './pages/leaderboard/Leaderboard';

// It will be removed and userId will be passed as Props to Leaderboard component
const userId = '5c7c4f26e2168b648bcdd3e2';

const App = () => (
  <BrowserRouter>
    <Header>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/forgotPassword" component={ForgotPassword} />
        <Route
          exact
          path="/leaderboard"
          render={routeProps => <LeaderboardPage {...{ userId }} {...routeProps} />}
        />
        <Route exact path="*" component={Page404} />
      </Switch>
    </Header>
  </BrowserRouter>
);

export default App;
