import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import actions from "./actions";
import ConfiguredEvents from "./Configured-Events";

class ConfiguredEventsContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this
      .props
      .onGetEvents();
  }
  render() {
    return <ConfiguredEvents
      isLoading={this.props.isLoading}
      events={this.props.events}
      error={this.props.error}
      selectedEvent={this.props.selectedEvent}
      isAddingEvent={this.props.isAddingEvent}
      onEventSelected={this.props.onEventSelected}
      onEventNameChanged={this.props.onEventNameChanged}
      onEventSaved={this.props.onEventSaved}/>;
  }
}

ConfiguredEventsContainer.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  events: PropTypes.array.isRequired,
  error: PropTypes.object,
  selectedEvent: PropTypes.object,
  isAddingEvent: PropTypes.bool,
  onGetEvents: PropTypes.func.isRequired,
  onEventSelected: PropTypes.func.isRequired,
  onEventNameChanged: PropTypes.func.isRequired,
  onEventSaved: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return state.configuredEvents;
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetEvents: () => {
      dispatch(actions.getEvents());
    },
    onEventSelected: (event) => {
      dispatch(actions.selectEvent(event));
    },
    onEventNameChanged: (name) => {
      dispatch(actions.changeEventName(name));
    },
    onEventSaved: (event) => {
      dispatch(actions.saveEvent(event));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ConfiguredEventsContainer
);