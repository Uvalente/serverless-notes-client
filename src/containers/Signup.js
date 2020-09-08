import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hookLib";
import { onError } from "../libs/errorLib";
import "./Signup.css";
import { Auth } from 'aws-amplify';

export default function Signup() {
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: ''
  })
  const history = useHistory()
  const [newUser, setNewUser] = useState(null)
  const { userHasAuthenticated } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)

  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    )
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0
  }

  async function handleSubmit(e) {
    e.preventDefault()

    setIsLoading(true)

    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password
      })
      setIsLoading(false)
      setNewUser(newUser)
    } catch (e) {
      // Check for the UsernameExistsException and resend code
      // if newUser.userConfirmed: false
      onError(e)
      setIsLoading(false)
    }
  }

  async function handleConfirmationSubmit(e) {
    e.preventDefault()

    setIsLoading(true)
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode)
      await Auth.signIn(fields.email, fields.password)
      userHasAuthenticated(true)
      history.push('/')
    } catch (e) {
      onError(e)
      setIsLoading(false)
    }
  }

  function renderForm() {
    return (
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
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            size='lg'
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Signup
        </LoaderButton>
      </form>
    )
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmationSubmit}>
        <Form.Group controlId="confirmationCode">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            size='lg'
            autoFocus
            type="tel"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
            aria-describedby="confirmationHelpBlock"
          />
          <Form.Text id="confirmationHelpBlock" muted>
            Please check your email for the code.
          </Form.Text>
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>
      </form>
    )
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  )

}