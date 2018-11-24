import React from "react";
import PropTypes from "prop-types";
import Notification from "./Notification";

const notificationExpirationInSeconds = 3;
// This value needs to match the transition speed set in style on the .expired class.
const notificationRemovalInSeconds = 2;

class NotificationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "new",
      displayer: null,
      expirer: null,
      remover: null
    };
  }

  componentDidMount() {
    this.setState(Object.assign({}, this.state, { displayer: this.scheduleDisplay() }));
  }

  componentDidUpdate(previousProps) {
    if (previousProps.isPaused !== this.props.isPaused) {
      if (this.props.isPaused) {
        this.pause();
      } else {
        this.play();
      }
    }
  }

  componentWillUnmount() {
    // cleanup to prevent memory leaks
    if (this.state.displayer) {
      clearTimeout(this.state.displayer);
    }
    if (this.state.expirer) {
      clearTimeout(this.state.expirer);
    }
    if (this.state.remover) {
      clearTimeout(this.state.remover);
    }
  }

  pause() {
    clearTimeout(this.state.displayer);
    clearTimeout(this.state.expirer);
    clearTimeout(this.state.remover);
    this.setState(Object.assign({}, this.state, {
      displayer: null,
      expirer: null,
      remover: null
    }));
  }

  play() {
    if (this.state.status === "new") {
      this.setState(Object.assign({}, this.state, {
        displayer: this.scheduleDisplay()
      }));
    } else if (this.state.status === "displayed") {
      this.setState(Object.assign({}, this.state, {
        expirer: this.scheduleExpiration()
      }));
    } else if (this.state.status === "expired") {
      this.setState(Object.assign({}, this.state, {
        remover: this.scheduleRemoval()
      }));
    }
  }

  scheduleDisplay() {
    return setTimeout(() => {
      this.setState(Object.assign({}, this.state, {
        status: "displayed",
        expirer: this.scheduleExpiration()
      }));
    }, 0);
  }

  scheduleExpiration() {
    return setTimeout(() => {
      this.setState(Object.assign({}, this.state, {
        status: "expired",
        remover: this.scheduleRemoval()
      }));
    }, notificationExpirationInSeconds * 1000);
  }

  scheduleRemoval() {
    return setTimeout(() => {
      this.props.onRemoveNotification(this.props.notification.id);
    }, notificationRemovalInSeconds * 1000);
  }

  render() {
    return <Notification
      notification={this.props.notification}
      status={this.state.status} />;
  }
}

NotificationContainer.propTypes = {
  notification: PropTypes.object.isRequired,
  isPaused: PropTypes.bool.isRequired,
  onRemoveNotification: PropTypes.func.isRequired
};

export default NotificationContainer;