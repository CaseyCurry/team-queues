import React from "react";
import PropTypes from "prop-types";
import Event from "./Event";

class EventContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    const event = this.props.event;
    return {
      event,
      selectedEventVersionNumber: event
        .versions
        .map((version) => version.number)
        .sort((x, y) => y - x)[0],
      selectedMap: null
    };
  }

  componentDidUpdate(previousProps) {
    if (this.props.event !== previousProps.event) {
      this.setState(this.getInitialState());
    }
  }

  modifyMap(property, mapIndex, value) {
    const event = JSON.parse(JSON.stringify(this.state.event));
    const version = event
      .versions
      .find((version) => version.number === this.state.selectedEventVersionNumber);
    let map = version.maps[mapIndex];
    if (!map) {
      map = {
        source: "",
        target: ""
      };
      version
        .maps
        .push(map);
    }
    map[property] = value;
    this.setState(Object.assign({}, this.state, {
      event,
      selectedMap: property + mapIndex
    }));
  }

  cancel() {
    this.setState(this.getInitialState());
  }

  toggleActiveState() {
    const event = Object.assign({}, this.state.event, {
      isActive: !this.state.event.isActive
    });
    this.setState(Object.assign({}, this.state, {
      event
    }));
  }

  selectPreviousVersion() {
    const previousVersion = this
      .state
      .event
      .versions
      .map((version) => version.number)
      .sort((x, y) => y - x)
      .find((number) => number < this.state.selectedEventVersionNumber);
    this.selectVersion(previousVersion);
  }

  selectNextVersion() {
    const nextVersion = this
      .state
      .event
      .versions
      .map((version) => version.number)
      .sort((x, y) => x - y)
      .find((number) => number > this.state.selectedEventVersionNumber);
    this.selectVersion(nextVersion);
  }

  selectVersion(number) {
    this.setState(
      Object.assign({}, this.state, {
        selectedEventVersionNumber: number
      })
    );
  }

  copyVersion() {
    const event = JSON.parse(JSON.stringify(this.state.event));
    const lastVersion = event
      .versions
      .sort((x, y) => y.number - x.number)[0];
    const nextNumber = lastVersion.number + 1;
    if (!lastVersion.maps.length) {
      event
        .versions
        .shift();
    }
    const selectedVersionMapsToCopy = this
      .state
      .event
      .versions
      .find((version) => version.number === this.state.selectedEventVersionNumber)
      .maps;
    event
      .versions
      .unshift({
        number: nextNumber,
        maps: selectedVersionMapsToCopy.slice()
      });
    this.setState(
      Object.assign({}, this.state, {
        event,
        selectedEventVersionNumber: nextNumber
      })
    );
  }

  doDisplayPreviousVersionSelector() {
    const oldestVersionNumber = this
      .state
      .event
      .versions
      .map((version) => version.number)
      .reduce((min, x) => x < min ? x : min);
    return this.state.event.versions.length > 1 && this.state.selectedEventVersionNumber > oldestVersionNumber;
  }

  doDisplayNextVersionSelector() {
    const latestVersionNumber = this
      .state
      .event
      .versions
      .map((version) => version.number)
      .reduce((max, x) => x > max ? x : max);
    return this.state.event.versions.length > 1 && this.state.selectedEventVersionNumber < latestVersionNumber;
  }

  render() {
    return <Event
      event={this.state.event}
      className={this.props.className}
      selectedEventVersionNumber={this.state.selectedEventVersionNumber}
      selectedMap={this.state.selectedMap}
      doDisplayPreviousVersionSelector={this.doDisplayPreviousVersionSelector()}
      doDisplayNextVersionSelector={this.doDisplayNextVersionSelector()}
      isSaving={this.props.isSaving}
      onSaved={this.props.onSaved}
      onCancelled={this.cancel.bind(this)}
      onMapModified={this.modifyMap.bind(this)}
      onActiveStateToggled={this.toggleActiveState.bind(this)}
      onPreviousVersionSelected={this.selectPreviousVersion.bind(this)}
      onNextVersionSelected={this.selectNextVersion.bind(this)}
      onVersionCopied={this.copyVersion.bind(this)} />;
  }
}

EventContainer.propTypes = {
  event: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onSaved: PropTypes.func.isRequired
};

export default EventContainer;
