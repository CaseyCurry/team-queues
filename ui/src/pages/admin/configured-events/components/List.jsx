import React from "react";
import PropTypes from "prop-types";

class List extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.className}>
        <ul>
          {
            this
              .props
              .events
              .map((event) => {
                let itemValue;
                const eventBeingAdded = event.isNew && this.props.isAddingEvent;
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
                  className={this.props.selectedEvent && this.props.selectedEvent.name === event.name || eventBeingAdded
                    ? "selected"
                    : undefined}
                  title={event.name}
                  onClick={() => this.props.onEventSelected(event)}>
                  {itemValue}
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
  onEventNameChanged: PropTypes.func.isRequired
};

export default List;
