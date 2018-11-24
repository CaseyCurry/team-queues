import React from "react";
import PropTypes from "prop-types";
import Info from "./Info";
import Warning from "./Warning";
import HighAlert from "./High-Alert";
import Error from "./Error";

const notificationExpirationInSeconds = 3;

class NotificationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew: true,
      isDisplayed: false,
      isExpired: false,
      displayer: this.scheduleDisplay(),
      expirer: null,
      remover: null
    };
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
    if (this.state.isNew) {
      this.setState(Object.assign({}, this.state, {
        displayer: this.scheduleDisplay()
      }));
    } else if (this.state.isDisplayed) {
      this.setState(Object.assign({}, this.state, {
        expirer: this.scheduleExpiration()
      }));
    } else if (this.state.isExpired) {
      this.setState(Object.assign({}, this.state, {
        remover: this.scheduleRemoval()
      }));
    }
  }

  scheduleDisplay() {
    return setTimeout(() => {
      this.setState(Object.assign({}, this.state, {
        isDisplayed: true,
        expirer: this.scheduleExpiration()
      }));
    }, 0);
  }

  scheduleExpiration() {
    return setTimeout(() => {
      this.setState(Object.assign({}, this.state, {
        isExpired: true,
        isDisplayed: false,
        remover: this.scheduleRemoval()
      }));
    }, notificationExpirationInSeconds * 1000);
  }

  scheduleRemoval() {
    return setTimeout(() => {
      this.props.onRemoveNotification(this.props.notification.id);
    }, notificationExpirationInSeconds + 3 * 1000);
  }

  render() {
    const notification = this.props.notification;
    const className = this.state.isExpired ?
      "expired" : this.state.isDisplayed ? "displayed" : "new";

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

NotificationContainer.propTypes = {
  notification: PropTypes.object.isRequired,
  isPaused: PropTypes.bool.isRequired,
  onRemoveNotification: PropTypes.func.isRequired
};

export default NotificationContainer;