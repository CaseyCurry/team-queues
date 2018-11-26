import React from "react";
import PropTypes from "prop-types";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      queues: []
    };
  }

  componentDidMount() {
    fetch("/api/queries/queues")
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          isLoaded: true,
          queues: result
        });
        if (result.length) {
          this.props.onQueueSelected(result[0].queueName, result[0].taskType);
        }
      }, (error) => {
        this.setState({ error, isLoaded: true });
      });
  }

  render() {
    if (this.state.error) {
      return <div>Error: {this.state.error.message}</div>;
    } else if (!this.state.isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <select onChange={(e) => {
          const queueName = e.target.options[e.target.selectedIndex].dataset.name;
          const taskType = e.target.options[e.target.selectedIndex].dataset.type;
          this.props.onQueueSelected(queueName, taskType);
          e.stopPropagation();
        }}>
          {
            this
              .state
              .queues
              .map((queue) => {
                const key = `${queue.queueName}.${queue.taskType}`;
                return <option key={key} data-name={queue.queueName} data-type={queue.taskType}>
                  {queue.queueName} / {queue.taskType}
                </option>;
              })
          }
        </select>
      );
    }
  }
}

List.propTypes = {
  onQueueSelected: PropTypes.func.isRequired
};

export default List;
