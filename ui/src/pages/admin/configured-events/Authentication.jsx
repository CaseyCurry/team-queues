import React from "react";
import Field from "../../components/Field";

const Authentication = ({
  token,
  email,
  password,
  error,
  emailNotFound,
  invalidPassword,
  handlers
}) => {
  if (token) {
    return handlers.handleSuccessfulAuthentication(token);
  }
  return <div className="authentication">
    <form onSubmit={handlers.handleSubmit}>
      <div className="field">
        <Field
          type="text"
          placeholder="enter your email"
          onChange={handlers.handleEmailChange}
          onValidation={() => validateEmail(email)}/> {emailNotFound && <span className="error">This email is not registered.</span>}
        {error && <span className="error">{error}</span>}
      </div>
      <div className="field">
        <Field
          type="password"
          placeholder="enter your password"
          onChange={handlers.handlePasswordChange}
          onValidation={() => validatePassword(password)}/> {invalidPassword && <span className="error">This password is invalid.</span>}
      </div>
      <div className="buttons">
        <input
          type="submit"
          value="Submit"
          disabled={!isFormValid(email, password, error, emailNotFound, invalidPassword)}/>
        <input
          type="button"
          value="Register"
          onClick={handlers.handleRegisterClick}/>
      </div>
    </form>
  </div>;
};

Authentication.propTypes = {
  token: React.PropTypes.string,
  email: React.PropTypes.string,
  password: React.PropTypes.string,
  error: React.PropTypes.string,
  emailNotFound: React.PropTypes.bool.isRequired,
  invalidPassword: React.PropTypes.bool.isRequired,
  handlers: React.PropTypes.object.isRequired
};

export default Authentication;

const validateEmail = (email) => {
  if (isRequiredFieldEmpty(email)) {
    return "Your email is required.";
  }
};

const validatePassword = (email) => {
  if (isRequiredFieldEmpty(email)) {
    return "Your password is required.";
  }
};

const isRequiredFieldEmpty = (value) => {
  return value == false;
};

const isFormValid = (email, password, error, emailNotFound, invalidPassword) => {
  if (validateEmail(email)) {
    return false;
  }
  if (validatePassword(password)) {
    return false;
  }
  if (error) {
    return false;
  }
  if (emailNotFound) {
    return false;
  }
  if (invalidPassword) {
    return false;
  }
  return true;
};
