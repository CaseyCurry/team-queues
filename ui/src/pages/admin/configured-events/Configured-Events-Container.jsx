import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import actions from "./actions";
import ConfiguredEvents from "./components/Configured-Events";

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
      areEventsLoading={this.props.areEventsLoading}
      events={this.props.events}
      selectedEvent={this.props.selectedEvent}
      isEventBeingAdded={this.props.isEventBeingAdded}
      searchString={this.props.searchString}
      isSaving={this.props.isSaving}
      onSelected={this.props.onSelected}
      onNameChanged={this.props.onNameChanged}
      onSaved={this.props.onSaved} />;
  }
}

ConfiguredEventsContainer.propTypes = {
  areEventsLoading: PropTypes.bool.isRequired,
  events: PropTypes.array.isRequired,
  selectedEvent: PropTypes.object,
  isEventBeingAdded: PropTypes.bool,
  searchString: PropTypes.string,
  isSaving: PropTypes.bool.isRequired,
  onGetEvents: PropTypes.func.isRequired,
  onSelected: PropTypes.func.isRequired,
  onNameChanged: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return state.configuredEvents;
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetEvents: () => {
      dispatch(actions.getEvents());
    },
    onSelected: (event) => {
      dispatch(actions.selectEvent(event));
    },
    onNameChanged: (name) => {
      dispatch(actions.changeEventName(name));
    },
    onSaved: (event) => {
      dispatch(actions.saveEvent(event));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfiguredEventsContainer);
