import React from "react";
import PropTypes from "prop-types";

class ConfiguredEvent extends React.Component {
  constructor(props) {
    super(props);
    // const defaultVersion = this.getDefaultVersion();
    // this.state = {
    //   selectedVersion: defaultVersion,
    //   event: props.event
    // };
  }

  // getDefaultVersion() {
  //   return this.props.event.versions.length
  //     ? this
  //       .props
  //       .event
  //       .versions[0]
  //     : null;
  // }
  //
  // componentDidUpdate(prevProps) {
  //   if (this.props.event !== prevProps.event) {
  //     const selectedVersion = this.getDefaultVersion();
  //     this.setState(Object.assign({}, this.state, {event: this.props.event, selectedVersion}));
  //   }
  // }

  render() {
    return <div className={this.props.className}>
      <label>Version:</label>
      <select value={this.props.selectedEventVersion.number} onChange={(e) => this.props.onEventVersionSelected(e.target.value)}>
        {
          this
            .props
            .event
            .versions
            .reverse()
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
            this.props.selectedEventVersion
              .maps
              .map((map) => {
                return <li key={map.source}>{map.source}
                  to {map.target}</li>;
              })
          }
        </ul>
      </div>
      {this.props.event.isNew && <button onClick={() => this.props.onEventSaved(this.props.event)}>Save</button>}
    </div>;
  }
}

ConfiguredEvent.propTypes = {
  event: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  selectedEventVersion: PropTypes.object.isRequired,
  onEventSaved: PropTypes.func.isRequired,
  onEventVersionSelected: PropTypes.func.isRequired
};

export default ConfiguredEvent;
