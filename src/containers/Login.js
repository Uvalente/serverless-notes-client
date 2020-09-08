import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Auth } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import { useHistory } from 'react-router-dom'
import "./Login.css";

export default function Login() {
  const { userHasAuthenticated } = useAppContext();
  const history = useHistory()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await Auth.signIn(email, password)
      alert("Logged in")
      userHasAuthenticated(true);
      history.push('/')
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            size='lg'
            autoFocus
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            size='lg'
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </Form.Group>
        <Button block disabled={!validateForm()} type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}