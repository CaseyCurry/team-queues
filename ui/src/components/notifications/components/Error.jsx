import React from "react";
import PropTypes from "prop-types";

// TODO: add some sort of id - correlation, error, session? - and add copy to clipboard button
const Error = ({ notification, className }) => {
  return <div className={`error ${className}`}>
    {notification.message}
  </div>;
};

Error.propTypes = {
  notification: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired
};

export default Error;