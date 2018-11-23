import React from "react";
import PropTypes from "prop-types";
import Info from "./Info";
import Warning from "./Warning";
import HighAlert from "./High-Alert";
import Error from "./Error";

class Notifications extends React.Component {
  render() {
    return <ul className="notifications">
      {
        this
          .props
          .notifications
          .sort((x, y) => x.id > y.id ? -1 : 1)
          .map((notification) => {
            return <li
              key={notification.id}
              className={notification.isExpired ? "expired" : notification.isDisplayed ? "displayed" : "new"}
              onClick={() => this.props.onRemoveNotification(notification.id)}>
              {
                notification.type === "info" &&
                <Info message={notification.message} />
              }
              {
                notification.type === "warning" &&
                <Warning message={notification.message} />
              }
              {
                notification.type === "highAlert" &&
                <HighAlert message={notification.message} />
              }
              {
                notification.type === "error" &&
                <Error message={notification.message} />
              }
            </li>;
          })
      }
    </ul>;
  }
}

Notifications.propTypes = {
  notifications: PropTypes.array.isRequired,
  onRemoveNotification: PropTypes.func.isRequired
};

export default Notifications;