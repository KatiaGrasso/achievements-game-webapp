import { useEffect, useState } from 'react';
import { LoginForm, LogoutButton } from './components/Auth.jsx';
import './App.css'
import API from "./API.js";
import { fetchTest } from './API.js';
import {Container, Toast, ToastBody } from 'react-bootstrap';
import FeedbackContext from "./contexts/FeedbackContext.js";
import {  Routes, Route ,Navigate, useLocation} from 'react-router-dom';
import Header from './components/Header.jsx';
import ObjectiveList from './components/ObjectiveList.jsx';
import Profile from './components/Profile.jsx';
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [shouldRefresh, setShouldRefresh] = useState(true);

  const setFeedbackFromError = (err) => {
    const message = err?.message || "Unknown Error";
    setFeedback(message);
  };

  useEffect(() => {
    if (loggedIn) {
      API.getUserInfo()
        .then((user) => {
          setLoggedIn(true);
          setUser(user);
        })
        .catch((e) => {
          if (loggedIn) setFeedbackFromError(e);
          setLoggedIn(false);
          setUser(null);
        });
    }
  }, [loggedIn]);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
      setFeedback("Benvenuto, " + user.name);
    } catch (e) {
      setFeedbackFromError(e);
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(null);
  };
  return (
    <FeedbackContext.Provider value={{ setFeedback, setFeedbackFromError, setShouldRefresh }}>
      <div>
        <Header loggedIn={loggedIn} onLogout={handleLogout} />
        <div className="container-fluid custom-gradient d-flex">
          <Container>
            <Routes>
              {/* Route di login */}
              <Route
                path="/login"
                element={
                  loggedIn ? (
                    <Navigate replace to="/" />
                  ) : (
                    <LoginForm onLogin={handleLogin} />
                  )
                }
              />
              
              {/* Rotte per utenti loggati */}
              {loggedIn ? (
                <Route path="/" element={<Profile />} />
              ) : (
                <Route path="/" element={<ObjectiveList />} />
              )}
  
              {/* Pagina non trovata */}
              <Route path="*" element={<h2>Pagina non trovata</h2>} />
            </Routes>
  
            {/* Toast per il feedback */}
            <Toast
              show={feedback !== ""}
              autohide
              onClose={() => setFeedback("")}
              delay={4000}
              position="top-end"
              className="position-fixed end-0 m-3"
            >
              <ToastBody>{feedback}</ToastBody>
            </Toast>
          </Container>
        </div>
      </div>
    </FeedbackContext.Provider>
  );
  
}

export default App;