import React from "react";
import PropTypes from "prop-types";
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