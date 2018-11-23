import React from "react";
import PropTypes from "prop-types";

// TODO: add some sort of id - correlation, error, session? - and add copy to clipboard button
const Warning = ({ message }) => {
  return <div className="warning">{message}</div>;
};

Warning.propTypes = {
  message: PropTypes.string.isRequired
};

export default Warning;