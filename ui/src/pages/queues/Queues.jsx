import React from "react";
import List from "./components/List";
import Tasks from "./components/Tasks";

class Queues extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedQueue: null
    };
  }

  handleQueueSelected(queue) {
    this.setState({
      selectedQueue: queue
    });
  }

  render() {
    return <div className="row">
      <List
        onQueueSelected={this
          .handleQueueSelected
          .bind(this)} />
      {
        this.state.selectedQueue &&
        <Tasks queue={this.state.selectedQueue} />
      }
    </div>;
  }
}

export default Queues;
