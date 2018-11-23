import React from "react";
import PropTypes from "prop-types";

const HighAlert = ({ message }) => {
  return <div className="high-alert">{message}</div>;
};

HighAlert.propTypes = {
  message: PropTypes.string.isRequired
};

export default HighAlert;