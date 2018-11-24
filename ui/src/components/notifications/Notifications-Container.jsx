import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import actions from "./actions";
import Notifications from "./components/Notifications";

class NotificationsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: props.notifications
    };
  }

  componentDidUpdate(previousProps) {
    if (previousProps !== this.props) {
      if (!this.props.isPaused) {
        this.setState(Object.assign({}, this.state, {
          notifications: this.props.notifications
        }));
      }
    }
  }

  render() {
    return <Notifications
      notifications={this.state.notifications}
      isPaused={this.props.isPaused}
      onRemoveNotification={this.props.onRemoveNotification}
      onPause={this.props.onPause}
      onPlay={this.props.onPlay} />;
  }
}

NotificationsContainer.propTypes = {
  notifications: PropTypes.array.isRequired,
  isPaused: PropTypes.bool.isRequired,
  onRemoveNotification: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return state.notifications;
};

const mapDispatchToProps = (dispatch) => {
  return {
    onRemoveNotification: (id) => {
      dispatch(actions.removeNotification(id));
    },
    onPause: () => {
      dispatch(actions.pause);
    },
    onPlay: () => {
      dispatch(actions.play);
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsContainer);
