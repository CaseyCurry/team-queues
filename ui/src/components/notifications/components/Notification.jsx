import React from "react";
import PropTypes from "prop-types";
import Info from "./Info";
import Warning from "./Warning";
import HighAlert from "./High-Alert";
import Error from "./Error";

class Notification extends React.Component {
  render() {
    const notification = this.props.notification;
    const className = `notification ${this.props.status}`;
    if (notification.type === "info") {
      return <Info className={className} notification={notification} />;
    } else if (notification.type === "warning") {
      return <Warning className={className} notification={notification} />;
    } else if (notification.type === "highAlert") {
      return <HighAlert className={className} notification={notification} />;
    } else {
      return <Error className={className} notification={notification} />;
    }
  }
}

Notification.propTypes = {
  notification: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired
};

export default Notification;