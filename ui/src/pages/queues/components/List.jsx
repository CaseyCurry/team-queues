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
    fetch("http://localhost:8083/api/queries/queues")
      .then(
        (response) => response.json()
      )
      .then((result) => {
        this.setState({isLoaded: true, queues: result});
        if (result.length) {
          this
            .props
            .onQueueSelected(result[0].queueId);
        }
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
        <select onChange={(event) => this.props.onQueueSelected(event.target.value)}>
          {
            this
              .state
              .queues
              .map((queue) => {
                return <option key={queue.queueId} value={queue.queueId}>
                  {queue.queueName}
                  / {queue.taskType}
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
