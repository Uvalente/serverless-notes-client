import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import Routes from "./Routes"
import "./App.css";

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    async function onLoad() {
      try {
        await Auth.currentSession();
        userHasAuthenticated(true);
      }
      catch (e) {
        if (e !== 'No current user') {
          alert(e);
        }
      }

      setIsAuthenticating(false);
    }

    onLoad();
  }, []);


  function handleLogout() {
    userHasAuthenticated(false);
  }

  return (
    !isAuthenticating &&
    <div className="App container">
      <Navbar bg='light' expand='lg'>
        <Navbar.Brand>
          <Link to="/">Scratch</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav >
            {
              isAuthenticated
                ? <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                : <>
                  <LinkContainer to='/signup'>
                    <Nav.Link>Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/login'>
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }} >
        <Routes />
      </AppContext.Provider>
    </div>
  );
}

export default App;