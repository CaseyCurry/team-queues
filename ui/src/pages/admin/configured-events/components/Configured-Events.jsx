import React from "react";
import PropTypes from "prop-types";
import Loader from "../../../../controls/Loader";
import ListContainer from "./List-Container";
import EventContainer from "./Event-Container";

class ConfiguredEvents extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // TODO: check for unsaved data
    if (this.props.areEventsLoading) {
      return (
        <div className="page">
          <Loader />
        </div>
      );
    } else {
      return (
        <div className="row page configured-events">
          <ListContainer
            className="col-sm-12 col-md-4 col-lg-3"
            events={this.props.events}
            isEventBeingAdded={this.props.isEventBeingAdded}
            searchString={this.props.searchString}
            isSaving={this.props.isSaving}
            onSelected={this.props.onSelected}
            onNameChanged={this.props.onNameChanged}
            onSaved={this.props.onSaved}
          />
          {this.props.selectedEvent && (
            <EventContainer
              className="d-none d-md-block col-md-8 col-lg-9"
              event={this.props.selectedEvent}
              onSaved={this.props.onSaved}
              isSaving={this.props.isSaving}
            />
          )}
        </div>
      );
    }
  }
}

ConfiguredEvents.propTypes = {
  areEventsLoading: PropTypes.bool.isRequired,
  events: PropTypes.array.isRequired,
  selectedEvent: PropTypes.object,
  isEventBeingAdded: PropTypes.bool,
  searchString: PropTypes.string,
  isSaving: PropTypes.bool.isRequired,
  onSelected: PropTypes.func.isRequired,
  onNameChanged: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired
};

export default ConfiguredEvents;
