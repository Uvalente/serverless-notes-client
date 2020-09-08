import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Auth } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib"
import { useFormFields } from "../libs/hookLib"
import { useHistory } from 'react-router-dom'
import LoaderButton from "../components/LoaderButton";
import "./Login.css";

export default function Login() {
  const { userHasAuthenticated } = useAppContext();
  const history = useHistory()

  const [isLoading, setIsLoading] = useState(false)
    const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: ''
  })

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true)

    try {
      await Auth.signIn(fields.email, fields.password)
      alert("Logged in")
      userHasAuthenticated(true);
      history.push('/')
    } catch (e) {
      onError(e)
      setIsLoading(false)
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
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            size='lg'
            value={fields.password}
            onChange={handleFieldChange}
            type="password"
          />
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
      </form>
    </div>
  );
}