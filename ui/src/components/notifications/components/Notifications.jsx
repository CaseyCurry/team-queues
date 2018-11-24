import React from "react";
import PropTypes from "prop-types";
import NotificationContainer from "./Notification-Container";

class Notifications extends React.Component {
  render() {
    let actionsClassName = "actions";
    if (this.props.notifications.length) {
      actionsClassName = `${actionsClassName} displayed`;
    }
    return <div className="notifications">
      <div className={actionsClassName}>
        {
          this.props.isPaused &&
          <img src="/resources/icons/play.svg" alt="play" onClick={() => this.props.onPlay()} />
        }
        {
          !this.props.isPaused &&
          <img src="/resources/icons/pause.svg" alt="pause" onClick={() => this.props.onPause()} />
        }
        <img src="/resources/icons/settings.svg" alt="settings" />
      </div>
      <ul>
        {
          this
            .props
            .notifications
            .sort((x, y) => x.id > y.id ? -1 : 1)
            .map((notification) => {
              return <li
                key={notification.id}
                onClick={() => this.props.onRemoveNotification(notification.id)}>
                <NotificationContainer
                  notification={notification}
                  isPaused={this.props.isPaused}
                  onRemoveNotification={this.props.onRemoveNotification} />
              </li>;
            })
        }
      </ul>
    </div>;
  }
}

Notifications.propTypes = {
  notifications: PropTypes.array.isRequired,
  isPaused: PropTypes.bool.isRequired,
  onRemoveNotification: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired
};

export default Notifications;