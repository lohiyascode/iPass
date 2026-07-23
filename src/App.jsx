import './App.css'
import Navbar from './components/navbar'
import Manager from './components/manager'
import Footer from './components/footer'
import Login from './components/login';
import { useState } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const handleLogout = () => {
    localStorage.clear();      // remove token + username
    setLoggedIn(false);        // triggers re-render → shows Login
  };

  return (
    <>
      <Navbar
        loggedIn={loggedIn}
        username={localStorage.getItem("username")}
        onLogout={handleLogout}
      />
      {loggedIn
        ? <Manager />
        : <Login onLogin={() => setLoggedIn(true)} />}
      <Footer />
    </>
  )
}

export default App
