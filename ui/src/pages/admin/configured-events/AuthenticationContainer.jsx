import {connect} from "react-redux";
import hashPassword from "../../modules/hash-password";
import * as actions from "./actions";
import Authentication from "./Authentication";

const mapStateToProps = (state) => {
  return {
    token: state.authentication.token,
    email: state.authentication.email,
    password: state.authentication.password,
    error: state.authentication.error,
    emailNotFound: state.authentication.emailNotFound,
    invalidPassword: state.authentication.invalidPassword,
    handleSuccessfulAuthentication: state.app.handleSuccessfulAuthentication
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    handlers: {
      handleRegisterClick: () => {
        dispatch(actions.displayRegistration);
      },
      handleEmailChange: (event) => {
        dispatch(actions.changeEmail(event.target.value));
      },
      handlePasswordChange: (event) => {
        dispatch(actions.changePassword(event.target.value));
      }
    }
  };
};

const mergeProps = (stateProps, dispatchProps) => {
  dispatchProps.handlers.handleSuccessfulAuthentication = stateProps.handleSuccessfulAuthentication;
  dispatchProps.handlers.handleSubmit = (event) => {
    event.preventDefault();
    const hashed = hashPassword(stateProps.password);
    dispatchProps.dispatch(actions.submitAuthentication(stateProps.email, hashed));
  };
  return Object.assign({}, stateProps, dispatchProps);
};

const AuthenticationContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Authentication);

export default AuthenticationContainer;
