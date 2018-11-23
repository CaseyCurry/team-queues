import React from "react";
import PropTypes from "prop-types";

const Info = ({ message }) => {
  return <div className="info">{message}</div>;
};

Info.propTypes = {
  message: PropTypes.string.isRequired
};

export default Info;