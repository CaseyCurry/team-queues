import React from "react";
import PropTypes from "prop-types";

const HighAlert = ({ notification, className }) => {
  return <div className={`high-alert ${className}`}>
    {notification.message}
  </div>;
};

HighAlert.propTypes = {
  notification: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired
};

export default HighAlert;