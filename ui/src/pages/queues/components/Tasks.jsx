import React from "react";
import PropTypes from "prop-types";

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoading: false,
      tasks: []
    };
  }

  componentDidMount() {
    this.getTasks();
  }

  componentDidUpdate(previousProps) {
    if (this.props !== previousProps) {
      this.getTasks();
    }
  }

  getTasks() {
    this.setState({
      isLoading: true,
      tasks: []
    });
    fetch(`/api/queries/queues/${this.props.queueName}/task-types/${this.props.taskType}/tasks`)
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          isLoading: false,
          tasks: result
        });
      }, (error) => {
        this.setState({
          error,
          isLoading: false
        });
      });
  }

  render() {
    if (this.state.error) {
      return <div>Error: {this.state.error.message}</div>;
    } else if (this.state.isLoading) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul>
          {
            this
              .state
              .tasks
              .map((task) => {
                const createdOn = new Date(task.createdOn).toString();
                const dueOn = new Date(task.dueOn).toString();
                return <li
                  key={task.id}
                  style={{
                    borderBottom: "1px solid gray"
                  }}>
                  <div>
                    <label>Created On:</label>{createdOn}</div>
                  <div>
                    <label>Status:</label>{task.status}</div>
                  <div>
                    <label>Assignee:</label>{task.assignee}</div>
                  <div>
                    <label>Due On:</label>{dueOn}</div>
                </li>;
              })
          }
        </ul>
      );
    }
  }
}

Tasks.propTypes = {
  queueName: PropTypes.string.isRequired,
  taskType: PropTypes.string.isRequired
};

export default Tasks;
