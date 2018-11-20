import React from "react";
import PropTypes from "prop-types";
import Event from "./Event";

const countToDisplay = 30;

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: null,
      onlyIncludeActiveEvents: true
    };
  }

  search(searchString) {
    this.setState(Object.assign({}, this.state, {searchString}));
  }

  toggleInclusionOfActiveEvents() {
    this.setState(Object.assign({}, this.state, {onlyIncludeActiveEvents: !this.state.onlyIncludeActiveEvents}));
  }

  render() {
    const eventToAdd = {
      name: "+ event",
      isActive: true,
      versions: [
        {
          number: 1,
          maps: []
        }
      ],
      isNew: true
    };
    let filteredEvents = this.state.searchString
      ? this
        .props
        .events
        .filter((event) => event.name.toLowerCase().includes(this.state.searchString.toLowerCase()))
      : this.props.events;
    if (this.state.onlyIncludeActiveEvents) {
      filteredEvents = filteredEvents
        .filter((event) => event.isActive);
    }
    return (
      <div className={this.props.className + " list"}>
        <div className="filter">
          <div className="search">
            <input placeholder="search" onChange={(e) => this.search(e.target.value)}/>
          </div>
          <div className="inactives">
            <label className="checkbox">only include active events
              <input
                type="checkbox"
                checked={this.state.onlyIncludeActiveEvents}
                onChange={() => this.toggleInclusionOfActiveEvents()}/>
              <span className="checkmark"></span>
            </label>
          </div>
        </div>
        <ul>
          {
            [eventToAdd]
              .concat(filteredEvents.slice(0, countToDisplay))
              .map((event) => {
                let itemValue;
                const eventBeingAdded = event.isNew && this.props.isAddingEvent;
                let className = this.props.selectedEvent && this.props.selectedEvent.name === event.name || eventBeingAdded
                  ? "selected"
                  : "unselected";
                if (!event.isActive) {
                  className = className + " inactive";
                }
                if (eventBeingAdded) {
                  itemValue = <input
                    autoFocus="autoFocus"
                    value={this.props.selectedEvent.name}
                    onChange={(e) => this.props.onEventNameChanged(e.target.value)}
                    onClick={(e) => e.stopPropagation()}/>;
                } else {
                  itemValue = event.name;
                }
                return <li
                  key={event.name}
                  className={className}
                  title={event.name}
                  onClick={() => this.props.onEventSelected(event)}>
                  <span>{itemValue}</span>
                  {
                    (this.props.selectedEvent === event || this.props.selectedEvent && this.props.selectedEvent.isNew && event.isNew) && <Event
                      className="workspace d-block d-md-none col-12"
                      event={this.props.selectedEvent}
                      onEventSaved={this.props.onEventSaved}/>
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
  selectedEvent: PropTypes.object,
  isAddingEvent: PropTypes.bool,
  onEventSelected: PropTypes.func.isRequired,
  onEventNameChanged: PropTypes.func.isRequired,
  onEventSaved: PropTypes.func.isRequired
};

export default List;
