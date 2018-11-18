import React from "react";
import PropTypes from "prop-types";
import List from "./components/List";
import ConfiguredEvent from "./components/Configured-Event";

class ConfiguredEvents extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.error) {
      return <div>Error: {this.props.error.message}</div>;
    } else if (this.props.isLoading) {
      // TODO: create loader
      return <div>Loading...</div>;
    } else {
      return <div className="row">
        <List
          className="vertical-tabs col-4"
          events={this.props.events}
          selectedEvent={this.props.selectedEvent}
          isAddingEvent={this.props.isAddingEvent}
          onEventSelected={this.props.onEventSelected}
          onEventNameChanged={this.props.onEventNameChanged}/> {
          this.props.selectedEvent && <ConfiguredEvent
            className="workspace-right col-8"
            event={this.props.selectedEvent}
            selectedEventVersion={this.props.selectedEventVersion}
            onEventSaved={this.props.onEventSaved}
            onEventVersionSelected={this.props.onEventVersionSelected}/>
        }
      </div>;
    }
  }
}

ConfiguredEvents.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  events: PropTypes.array.isRequired,
  error: PropTypes.object,
  selectedEvent: PropTypes.object,
  isAddingEvent: PropTypes.bool,
  selectedEventVersion: PropTypes.object,
  onEventSelected: PropTypes.func.isRequired,
  onEventNameChanged: PropTypes.func.isRequired,
  onEventSaved: PropTypes.func.isRequired,
  onEventVersionSelected: PropTypes.func.isRequired
};

export default ConfiguredEvents;
