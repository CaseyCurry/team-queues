import React from "react";
import PropTypes from "prop-types";
import EventContainer from "./Event-Container";

class List extends React.Component {
  render() {
    return (
      <div className={this.props.className + " vertical-tabs list"}>
        <div className="filter">
          <div className="search">
            <input
              placeholder="search"
              value={this.props.searchString ? this.props.searchString : ""}
              onChange={(e) => {
                this.props.onSearch(e.target.value);
                e.stopPropagation();
              }} />
          </div>
          <div className="inactives">
            <label className="checkbox">only include active events
              <input
                type="checkbox"
                checked={this.props.onlyIncludeActiveEvents}
                onChange={(e) => {
                  this.props.onInclusionOfActiveEventsToggled();
                  e.stopPropagation();
                }} />
              <span className="checkmark"></span>
            </label>
          </div>
        </div>
        <ul>
          {
            this
              .props
              .events
              .map((event) => {
                let itemValue;
                const isThisEventBeingAdded = event.isNew && this.props.isEventBeingAdded;
                const isThisEventSelected = this.props.selectedEvent && this.props.selectedEvent.name === event.name;
                let className = isThisEventSelected || isThisEventBeingAdded ?
                  "selected" : "unselected";
                if (!event.isActive && !event.isNew) {
                  className = `${className} inactive`;
                }
                if (isThisEventBeingAdded) {
                  itemValue =
                    <input
                      autoFocus="autoFocus"
                      placeholder="name"
                      value={this.props.selectedEvent.name}
                      onChange={(e) => {
                        this.props.onNameChanged(e.target.value);
                        e.stopPropagation();
                      }}
                      onClick={(e) => e.stopPropagation()} />;
                } else {
                  itemValue = event.name;
                }
                return <li
                  key={event.name}
                  className={className}
                  title={event.name}
                  onClick={(e) => {
                    this.props.onSelected(event);
                    e.stopPropagation();
                  }}>
                  <span>{itemValue}</span>
                  {
                    (isThisEventSelected || isThisEventBeingAdded) &&
                    <EventContainer
                      className="d-block d-md-none col-12"
                      event={this.props.selectedEvent}
                      onSaved={this.props.onSaved}
                      isSaving={this.props.isSaving} />
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
  events: PropTypes.array.isRequired,
  className: PropTypes.string.isRequired,
  selectedEvent: PropTypes.object,
  isEventBeingAdded: PropTypes.bool.isRequired,
  onlyIncludeActiveEvents: PropTypes.bool.isRequired,
  searchString: PropTypes.string,
  isSaving: PropTypes.bool.isRequired,
  onSelected: PropTypes.func.isRequired,
  onNameChanged: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  onInclusionOfActiveEventsToggled: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired
};

export default List;
