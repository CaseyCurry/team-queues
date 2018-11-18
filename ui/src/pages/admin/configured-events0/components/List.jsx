import React from "react";
import PropTypes from "prop-types";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      events: [],
      selectedEvent: props.selectedEvent,
      eventBeingAdded: null
    };
    this.eventToAdd = {
      name: "+ event",
      versions: [
        {
          number: 1,
          maps: []
        }
      ]
    };
  }

  componentDidMount() {
    this.getConfiguredEvents();
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedEvent !== prevProps.selectedEvent && !this.state.eventBeingAdded) {
      this.getConfiguredEvents();
    }
  }

  getConfiguredEvents() {
    fetch("http://localhost:8083/api/commands/configured-events")
      .then(
        (response) => response.json()
      )
      .then((result) => {
        const sortedResult = result.sort(
          (x, y) => x.name.toLowerCase() < y.name.toLowerCase()
            ? -1
            : 1
        );
        this.setState({isLoaded: true, events: sortedResult});
        if (result.length) {
          const selectedEvent = this.state.selectedEvent
            ? result.find((event) => event.name === this.state.selectedEvent.name)
            : result[0];
          this.handleEventSelection(selectedEvent);
        }
      }, (error) => {
        this.setState({error, isLoaded: true});
      });
  }

  handleEventSelection(selectedEvent) {
    if (selectedEvent === this.eventToAdd) {
      const eventBeingAdded = Object.assign({}, selectedEvent, {
        name: "",
        isNew: true
      });
      this.setState(Object.assign({}, this.state, {
        eventBeingAdded: eventBeingAdded,
        selectedEvent: eventBeingAdded
      }));
      this
        .props
        .onEventSelected(eventBeingAdded);
      return;
    }
    this
      .props
      .onEventSelected(selectedEvent);
    this.setState(Object.assign({}, this.state, {
      eventBeingAdded: null,
      selectedEvent: selectedEvent
    }));
  }

  handleEventNameChange(e) {
    const eventBeingAdded = Object.assign(
      {},
      this.state.eventBeingAdded,
      {name: e.target.value}
    );
    this.setState(Object.assign({}, this.state, {eventBeingAdded}));
    this.props.onEventNameChanged(eventBeingAdded);
  }

  render() {
    if (this.state.error) {
      return <div>Error: {this.state.error.message}</div>;
    } else if (!this.state.isLoaded) {
      // TODO: create loader
      return <div>Loading...</div>;
    } else {
      const firstEvent = this.state.eventBeingAdded
        ? this.state.eventBeingAdded
        : this.eventToAdd;
      return (
        <div className={this.props.className}>
          <ul>
            {
              [firstEvent]
                .concat(this.state.events)
                .map((event) => {
                  let itemValue;
                  if (event === this.state.eventBeingAdded) {
                    itemValue = <input
                      autoFocus="autoFocus"
                      value={event.name}
                      onChange={(e) => this.handleEventNameChange(e)}
                      onClick={(e) => e.stopPropagation()}/>;
                  } else {
                    itemValue = event.name;
                  }
                  return <li
                    key={event.name}
                    className={this.state.selectedEvent === event
                      ? "selected"
                      : undefined}
                    title={event.name}
                    onClick={() => this.handleEventSelection(event)}>
                    {itemValue}
                  </li>;
                })
            }
          </ul>
        </div>
      );
    }
  }
}

List.propTypes = {
  onEventSelected: PropTypes.func.isRequired,
  onEventNameChanged: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  selectedEvent: PropTypes.object
};

export default List;
