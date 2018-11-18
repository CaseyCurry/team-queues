import React from "react";
import List from "./components/List";
import Event from "./components/Event";

class ConfiguredEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEvent: null
    };
  }

  handleEventSelected(event) {
    this.setState({selectedEvent: event});
  }

  handleEventSaved(event) {
    const newEvent = Object.assign(
      {},
      event,
      {name: this.state.selectedEvent.name}
    );
    this.setState({selectedEvent: newEvent});
  }

  handleEventNameChange(event) {
    this.setState({selectedEvent: event});
  }

  render() {
    return <div className="row">
      <List
        className="vertical-tabs col-4"
        onEventSelected={this
          .handleEventSelected
          .bind(this)}
        onEventNameChanged={this
          .handleEventNameChange
          .bind(this)}
        selectedEvent={this.state.selectedEvent}/> {
        this.state.selectedEvent && <Event
            className="workspace-right col-8"
            event={this.state.selectedEvent}
            onEventSaved={this
              .handleEventSaved
              .bind(this)}/>
      }
    </div>;
  }
}

export default ConfiguredEvents;
