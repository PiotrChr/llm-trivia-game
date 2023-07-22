import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { UserContext } from './UserContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GamePage from './pages/GamePage';
import GameWelcomePage from './pages/GameWelcomePage';
import ScorePage from './pages/ScorePage';
import StatsPage from './pages/StatsPage';
import ErrorPage from './pages/ErrorPage';
import Layout from './components/shared/Layout';
import { PrivateRoute, AuthProvider } from './routing/AuthProvider';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <UserContext.Provider value={{ user, setUser }}>
        <AuthProvider>
          <Layout>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/login" component={LoginPage} />
              <Route path="/signup" component={SignupPage} />
              <Route exact path="/game/welcome" component={PrivateRoute(GameWelcomePage)} />
              <Route path="/game" component={PrivateRoute(GamePage)} />
              <Route path="/score" component={PrivateRoute(ScorePage)} />
              <Route path="/stats" component={PrivateRoute(StatsPage)} />
              <Route component={ErrorPage} />
            </Switch>
          </Layout>
        </AuthProvider>
      </UserContext.Provider>
    </Router>
  );
}

export default App;