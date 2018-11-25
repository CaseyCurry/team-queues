import React from "react";
import PropTypes from "prop-types";
import List from "./List";

const countToDisplay = 30;

class ListContainer extends React.Component {
  constructor(props) {
    super(props);
    const onlyIncludeActiveEvents = true;
    const filteredEvents = this.filter(
      this.props.searchString,
      onlyIncludeActiveEvents
    );
    this.state = Object.assign({}, filteredEvents);
  }

  search(searchString) {
    const filteredEvents = this.filter(
      searchString,
      this.state.onlyIncludeActiveEvents
    );
    this.setState(Object.assign({}, this.state, filteredEvents));
  }

  filter(searchString, onlyIncludeActiveEvents) {
    let filteredEvents = this.props.events && searchString ?
      this
        .props
        .events
        .filter((event) => event.name.toLowerCase().includes(searchString.toLowerCase()))
      : this.props.events;
    if (onlyIncludeActiveEvents) {
      filteredEvents = filteredEvents.filter((event) => event.isActive);
    }
    const selectedEvent = filteredEvents.length ? filteredEvents[0] : null;
    if (selectedEvent) {
      if (!this.state || selectedEvent !== this.state.selectedEvent) {
        this
          .props
          .onSelected(selectedEvent);
      }
    }
    return {
      filteredEvents,
      selectedEvent,
      searchString,
      onlyIncludeActiveEvents
    };
  }

  toggleInclusionOfActiveEvents() {
    const filteredEvents = this.filter(this.state.searchString, !this.state.onlyIncludeActiveEvents);
    this.setState(Object.assign({}, this.state, filteredEvents));
  }

  select(selectedEvent) {
    if (selectedEvent.isNew) {
      selectedEvent = Object.assign({}, selectedEvent, {
        name: ""
      });
    }
    this
      .props
      .onSelected(selectedEvent);
    this.setState(Object.assign({}, this.state, { selectedEvent }));
  }

  changeName(name) {
    const selectedEvent = Object.assign({}, this.state.selectedEvent, { name });
    this.setState(Object.assign({}, this.state, { selectedEvent }));
    this
      .props
      .onNameChanged(name);
  }

  render() {
    const eventToAdd = {
      name: "+ EVENT",
      isActive: false,
      versions: [
        {
          number: 1,
          maps: [
            {
              source: "",
              target: "foreignId"
            }
          ]
        }
      ],
      isNew: true
    };
    const events = [eventToAdd]
      .concat(this
        .state
        .filteredEvents
        .slice(0, countToDisplay));
    return <List
      events={events}
      className={this.props.className}
      selectedEvent={this.state.selectedEvent}
      isEventBeingAdded={this.props.isEventBeingAdded}
      onlyIncludeActiveEvents={this.state.onlyIncludeActiveEvents}
      searchString={this.state.searchString}
      isSaving={this.props.isSaving}
      onSelected={this.select.bind(this)}
      onNameChanged={this.changeName.bind(this)}
      onSaved={this.props.onSaved}
      onInclusionOfActiveEventsToggled={this.toggleInclusionOfActiveEvents.bind(this)}
      onSearch={this.search.bind(this)} />;
  }
}

ListContainer.propTypes = {
  className: PropTypes.string.isRequired,
  events: PropTypes.array.isRequired,
  isEventBeingAdded: PropTypes.bool,
  searchString: PropTypes.string,
  isSaving: PropTypes.bool.isRequired,
  onSelected: PropTypes.func.isRequired,
  onNameChanged: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired
};

export default ListContainer;
