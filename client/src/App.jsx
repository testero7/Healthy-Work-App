import React, { useEffect, useState } from 'react';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Home from './pages/Home';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Panel from './components/Panel';
import { useSelector } from 'react-redux';
import Pomodoro from './pages/Pomodoro';
import { store, persistor } from './redux/store.js';
import Timer from './pages/Timer';
import TimerPage from './pages/TimerPage';
import Footer from './components/Footer';
import UserHome from './pages/UserHome.jsx';
import Settings from './pages/Settings.jsx';
export default function App() {
  const { currentUser } = useSelector((state) => state.user);
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const checkAccessTokenInCookies = () => {
      const cookies = document.cookie.split(';').map((cookie) => cookie.trim());
      for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'acc_token') {
          setAccessToken(value);
          break;
        }
      }
    };

    checkAccessTokenInCookies();
  }, []);

  return (
    <BrowserRouter>
      <Header />
      {currentUser && <Panel />}
      <Routes>
        <Route
          path="/"
          element={currentUser ? <Navigate to="/home" /> : <Home />}
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/sign-in"
          element={currentUser ? <Navigate to="/home" /> : <SignIn />}
        />
        <Route
          path="/sign-up"
          element={currentUser ? <Navigate to="/home" /> : <SignUp />}
        />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/timer/:id" element={<TimerPage />} />
          <Route path="/timer/:configId/:pomodoroId" element={<Timer />} />
          <Route path="/home" element={<UserHome />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
