import React from "react";
import PropTypes from "prop-types";

const Warning = ({ notification, className }) => {
  return <div className={`warning ${className}`}>
    {notification.message}
  </div>;
};

Warning.propTypes = {
  notification: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired
};

export default Warning;