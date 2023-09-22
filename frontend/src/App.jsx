import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GamePage from './pages/GamePage';
import GameWelcomePage from './pages/GameWelcomePage';
import GameHostPage from './pages/GameHostPage';
import GameJoinPage from './pages/GameJoinPage';
import GameListPage from './pages/GameListPage';
import ScorePage from './pages/ScorePage';
import StatsPage from './pages/StatsPage';
import ErrorPage from './pages/ErrorPage';
import LogoutPage from './pages/LogoutPage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import AboutGamePage from './pages/AboutGamePage';
import AboutAuthorPage from './pages/AboutAuthorPage';
import FriendsPage from './pages/FriendsPage';
import NotificationsPage from './pages/NotificationsPage';
import Layout from './components/shared/Layout/Layout';
import { PrivateRoute, AuthProvider } from './routing/AuthProvider';
import LayoutProvider from './components/shared/Layout/LayoutProvider';

function App() {
  return (
    <Router>
      <LayoutProvider>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route exact path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/about_game" element={<AboutGamePage />} />
              <Route path="/about_author" element={<AboutAuthorPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route
                path="/profile"
                exact
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/friends"
                exact
                element={
                  <PrivateRoute>
                    <FriendsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/notifications"
                exact
                element={
                  <PrivateRoute>
                    <NotificationsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/game/welcome"
                exact
                element={
                  <PrivateRoute>
                    <GameWelcomePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/game/host"
                exact
                element={
                  <PrivateRoute>
                    <GameHostPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/game/join"
                element={
                  <PrivateRoute>
                    <GameJoinPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/game/join/:gameId"
                element={
                  <PrivateRoute>
                    <GameJoinPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/game/list"
                exact
                element={
                  <PrivateRoute>
                    <GameListPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/game/:gameId/score"
                element={
                  <PrivateRoute>
                    <ScorePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/game/:gameId/stats"
                element={
                  <PrivateRoute>
                    <StatsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/game/:gameId"
                element={
                  <PrivateRoute>
                    <GamePage />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<ErrorPage />} />
              <Route path="/error/:errorId" element={<ErrorPage />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </LayoutProvider>
    </Router>
  );
}

export default App;
