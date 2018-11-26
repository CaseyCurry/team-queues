import React from "react";
import PropTypes from "prop-types";

const Info = ({ notification, className }) => {
  return <div className={`info ${className}`}>
    {notification.message}
  </div>;
};

Info.propTypes = {
  notification: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired
};

export default Info;