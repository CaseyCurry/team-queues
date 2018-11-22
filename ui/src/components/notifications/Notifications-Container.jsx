import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import actions from "./actions";
import Notifications from "./components/Notifications";

class NotificationsContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Notifications
      notifications={this.props.notifications}
      onRemoveNotification={this.props.onRemoveNotification} />;
  }
}

NotificationsContainer.propTypes = {
  notifications: PropTypes.array.isRequired,
  onRemoveNotification: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    notifications: state.notifications
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onRemoveNotification: (id) => {
      dispatch(actions.removeNotification(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsContainer);
