import React from "react";
import PropTypes from "prop-types";

class Event extends React.Component {
  constructor(props) {
    super(props);
    const defaultVersion = this.getDefaultVersion();
    this.state = {
      selectedVersion: defaultVersion,
      event: props.event
    };
  }

  getDefaultVersion() {
    return this.props.event.versions.length
      ? this
        .props
        .event
        .versions[0]
      : null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.event !== prevProps.event) {
      const selectedVersion = this.getDefaultVersion();
      this.setState(Object.assign({}, this.state, {event: this.props.event, selectedVersion}));
    }
  }

  render() {
    return <div className={this.props.className}>
      <label>Version:</label>
      <select onChange={(event) => this.handleVersionSelected(event.target.value)}>
        {
          this
            .props
            .event
            .versions
            .map((version) => {
              return <option key={version.number} value={version}>
                {version.number}
              </option>;
            })
        }
      </select>
      <div>
        <label>Maps</label>
        <ul>
          {
            this
              .state
              .selectedVersion
              .maps
              .map((map) => {
                return <li key={map.source}>{map.source}
                  to {map.target}</li>;
              })
          }
        </ul>
      </div>
      {this.props.event.isNew && <button onClick={() => this.props.onEventSaved(this.state.event)}>Save</button>}
    </div>;
  }
}

Event.propTypes = {
  event: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  onEventSaved: PropTypes.func.isRequired
};

export default Event;
