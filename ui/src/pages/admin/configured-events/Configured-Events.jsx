import React from "react";
import PropTypes from "prop-types";
import List from "./components/List";
import Event from "./components/Event";

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
      return <div className="row configured-events">
        <List
          className="vertical-tabs col-4"
          events={this.props.events}
          selectedEvent={this.props.selectedEvent}
          isAddingEvent={this.props.isAddingEvent}
          onEventSelected={this.props.onEventSelected}
          onEventNameChanged={this.props.onEventNameChanged}/> {
          this.props.selectedEvent && <Event
            className="workspace-right col-8"
            event={this.props.selectedEvent}
            onEventSaved={this.props.onEventSaved}/>
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
  onEventSelected: PropTypes.func.isRequired,
  onEventNameChanged: PropTypes.func.isRequired,
  onEventSaved: PropTypes.func.isRequired
};

export default ConfiguredEvents;
