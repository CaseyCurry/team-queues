import React from "react";
import PropTypes from "prop-types";

// TODO: add some sort of id - correlation, error, session? - and add copy to clipboard button
const Error = ({ message }) => {
  return <div className="error">{message}</div>;
};

Error.propTypes = {
  message: PropTypes.string.isRequired
};

export default Error;