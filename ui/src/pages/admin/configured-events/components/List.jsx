import React from "react";
import PropTypes from "prop-types";
import Event from "./Event";

const countToDisplay = 30;

class List extends React.Component {
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
        .filter(
          (event) => event.name.toLowerCase().includes(searchString.toLowerCase())
        )
      : this.props.events;
    if (onlyIncludeActiveEvents) {
      filteredEvents = filteredEvents.filter((event) => event.isActive);
    }
    const selectedEvent = filteredEvents.length ? filteredEvents[0] : null;
    if (!this.state || selectedEvent !== this.state.selectedEvent) {
      this
        .props
        .onEventSelected(selectedEvent);
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

  selectEvent(selectedEvent) {
    if (selectedEvent.isNew) {
      selectedEvent = Object.assign({}, selectedEvent, {
        name: ""
      });
    }

    this
      .props
      .onEventSelected(selectedEvent);
    this.setState(Object.assign({}, this.state, { selectedEvent }));
  }

  changeEventName(name) {
    const selectedEvent = Object.assign({}, this.state.selectedEvent, { name });
    this.setState(Object.assign({}, this.state, { selectedEvent }));
    this
      .props
      .onEventNameChanged(name);
  }

  render() {
    const eventToAdd = {
      name: "+ event",
      isActive: true,
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
    return (
      <div className={this.props.className + " list"}>
        <div className="filter">
          <div className="search">
            <input
              placeholder="search"
              value={this.state.searchString ? this.state.searchString : ""}
              onChange={(e) => this.search(e.target.value)} />
          </div>
          <div className="inactives">
            <label className="checkbox">only include active events
              <input
                type="checkbox"
                checked={this.state.onlyIncludeActiveEvents}
                onChange={() => this.toggleInclusionOfActiveEvents()} />
              <span className="checkmark"></span>
            </label>
          </div>
        </div>
        <ul>
          {
            [eventToAdd]
              .concat(this
                .state
                .filteredEvents
                .slice(0, countToDisplay))
              .map((event) => {
                let itemValue;
                const eventBeingAdded = event.isNew && this.props.isAddingEvent;
                let className = this.state.selectedEvent && this.state.selectedEvent.name === event.name || eventBeingAdded ?
                  "selected" : "unselected";
                if (!event.isActive) {
                  className = className + " inactive";
                }
                if (eventBeingAdded) {
                  itemValue =
                    <input
                      autoFocus="autoFocus"
                      value={this.state.selectedEvent.name}
                      onChange={(e) => this.changeEventName(e.target.value)}
                      onClick={(e) => e.stopPropagation()} />;
                } else {
                  itemValue = event.name;
                }
                return <li
                  key={event.name}
                  className={className}
                  title={event.name}
                  onClick={() => this.selectEvent(event)}>
                  <span>{itemValue}</span>
                  {
                    (this.state.selectedEvent === event || this.state.selectedEvent && this.state.selectedEvent.isNew && event.isNew) &&
                    <Event
                      className="workspace d-block d-md-none col-12"
                      event={this.state.selectedEvent}
                      onEventSaved={this.props.onEventSaved} />
                  }
                </li>;
              })
          }
        </ul>
      </div>
    );
  }
}

List.propTypes = {
  className: PropTypes.string.isRequired,
  events: PropTypes.array.isRequired,
  isAddingEvent: PropTypes.bool,
  searchString: PropTypes.string,
  onEventSelected: PropTypes.func.isRequired,
  onEventNameChanged: PropTypes.func.isRequired,
  onEventSaved: PropTypes.func.isRequired
};

export default List;
