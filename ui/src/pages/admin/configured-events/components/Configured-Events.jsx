import React from "react";
import PropTypes from "prop-types";
import Loader from "../../../../controls/Loader";
import List from "./List";
import Event from "./Event";

class ConfiguredEvents extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.areEventsLoading) {
      return <div className="page">
        <Loader />
      </div>;
    } else {
      return <div className="row page configured-events">
        <List
          className="col-sm-12 col-md-4 col-lg-3"
          events={this.props.events}
          isAddingEvent={this.props.isAddingEvent}
          searchString={this.props.searchString}
          isEventSaving={this.props.isEventSaving}
          onEventSelected={this.props.onEventSelected}
          onEventNameChanged={this.props.onEventNameChanged}
          onEventSaved={this.props.onEventSaved} />
        {
          this.props.selectedEvent &&
          <Event
            className="d-none d-md-block col-md-8 col-lg-9"
            event={this.props.selectedEvent}
            onEventSaved={this.props.onEventSaved}
            isEventSaving={this.props.isEventSaving} />
        }
      </div>;
    }
  }
}

ConfiguredEvents.propTypes = {
  areEventsLoading: PropTypes.bool.isRequired,
  events: PropTypes.array.isRequired,
  selectedEvent: PropTypes.object,
  isAddingEvent: PropTypes.bool,
  searchString: PropTypes.string,
  isEventSaving: PropTypes.bool.isRequired,
  onEventSelected: PropTypes.func.isRequired,
  onEventNameChanged: PropTypes.func.isRequired,
  onEventSaved: PropTypes.func.isRequired
};

export default ConfiguredEvents;
