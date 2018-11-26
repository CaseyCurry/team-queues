import React from "react";
import List from "./components/List";
import Tasks from "./components/Tasks";

class Queues extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedQueueName: null,
      selectedTaskType: null
    };
  }

  handleQueueSelected(queueName, taskType) {
    this.setState({
      selectedQueueName: queueName,
      selectedTaskType: taskType
    });
  }

  render() {
    return <div className="row page">
      <List onQueueSelected={this.handleQueueSelected.bind(this)} />
      {
        this.state.selectedQueueName &&
        <Tasks
          queueName={this.state.selectedQueueName}
          taskType={this.state.selectedTaskType} />
      }
    </div>;
  }
}

export default Queues;
