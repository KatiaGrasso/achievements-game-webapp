import { useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import PropTypes from "prop-types";

// Log-in form
function LoginForm(props) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    props.onLogin(credentials)
      .catch( (err) => {
        if(err.message === "Unauthorized")
          setErrorMessage("Invalid username and/or password");
        else
          setErrorMessage(err.message);
        setShow(true);
      });
  };

  return (
     <div className="login-container">
    <Row >
  <Col >
    <h1 >Accedi per giocare</h1>
    <Form onSubmit={handleSubmit}>
      <Alert
        dismissible
        show={show}
        onClose={() => setShow(false)}
        variant="danger">
        {errorMessage}
      </Alert>
      <Form.Group  controlId="username">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={username}
          placeholder="user@polito.it"
          onChange={(ev) => setUsername(ev.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          placeholder="Enter the password"
          onChange={(ev) => setPassword(ev.target.value)}
          required
          minLength={6}
        />
      </Form.Group>
      <Button type="submit">Login</Button>
    </Form>
  </Col>
</Row></div>

  )
}

LoginForm.propTypes = {
  login: PropTypes.func,
}

// TODO: Navigate...

function LogoutButton(props) {
  return (
    <Button variant="outline-light" onClick={props.logout}>Logout</Button>
  )
}

LogoutButton.propTypes = {
  logout: PropTypes.func
}

function LoginButton() {
  return (
    <Button variant="outline-light" onClick={()=> console.log ("logging in")}>Login</Button>
  )
}

export { LoginForm, LogoutButton, LoginButton };
