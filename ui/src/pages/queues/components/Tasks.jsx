import React from "react";
import PropTypes from "prop-types";

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      tasks: []
    };
  }

  componentDidMount() {
    this.getTasks();
  }

  componentDidUpdate(prevProps) {
    if (this.props.queue !== prevProps.queue) {
      this.getTasks();
    }
  }

  getTasks() {
    fetch(`http://localhost:8083/api/queries/queues/${this.props.queue}/tasks`)
      .then(
        (response) => response.json()
      )
      .then((result) => {
        this.setState({isLoaded: true, tasks: result});
      }, (error) => {
        this.setState({error, isLoaded: true});
      });
  }

  render() {
    if (this.state.error) {
      return <div>Error: {this.state.error.message}</div>;
    } else if (!this.state.isLoaded) {
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
  queue: PropTypes.string.isRequired
};

export default Tasks;
