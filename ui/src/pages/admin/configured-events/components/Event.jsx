import React from "react";
import PropTypes from "prop-types";

class Event extends React.Component {
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
      mapInputSelected: null
    };
  }

  componentDidUpdate(previousProps) {
    // TODO: handle when changes are made and the new event name is changed
    if (this.props.event !== previousProps.event) {
      this.setState(this.getInitialState());
    }
  }

  changeMap(property, mapIndex, value) {
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
      mapInputSelected: property + mapIndex
    }));
  }

  selectVersion(number) {
    // TODO: if there are no maps, allow the user to manually set the version number
    this.setState(
      Object.assign({}, this.state, {selectedEventVersionNumber: number})
    );
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
      .unshift({number: nextNumber, maps: selectedVersionMapsToCopy.slice()});
    this.setState(
      Object.assign({}, this.state, {event, selectedEventVersionNumber: nextNumber})
    );
  }

  doDisplayPreviousVersionSelector(versionsToRender) {
    const oldestVersionNumber = this
      .state
      .event
      .versions
      .map((version) => version.number)
      .reduce(
        (min, x) => x < min
          ? x
          : min
      );
    return this.state.event.versions.length > versionsToRender.length && this.state.selectedEventVersionNumber > oldestVersionNumber;
  }

  doDisplayNextVersionSelector(versionsToRender) {
    const latestVersionNumber = this
      .state
      .event
      .versions
      .map((version) => version.number)
      .reduce(
        (max, x) => x > max
          ? x
          : max
      );
    return this.state.event.versions.length > versionsToRender.length && this.state.selectedEventVersionNumber < latestVersionNumber;
  }

  getVersionsToRender() {
    const versionCountToRender = 1;
    const sortedVersions = this
      .state
      .event
      .versions
      .map((version) => version.number)
      .sort((x, y) => x - y);
    const filteredVersions = sortedVersions.filter(
      (number) => number <= this.state.selectedEventVersionNumber
    );
    const versionsToRender = filteredVersions.length > versionCountToRender
      ? filteredVersions.slice(
        filteredVersions.length - versionCountToRender,
        filteredVersions.length
      )
      : filteredVersions;
    const spacesToFill = sortedVersions.length >= versionCountToRender
      ? versionCountToRender - versionsToRender.length
      : 0;
    for (let i = 0; i < spacesToFill; i++) {
      versionsToRender.push(sortedVersions[versionsToRender.length]);
    }
    return versionsToRender;
  }

  renderMaps() {
    const maps = this
      .state
      .event
      .versions
      .find((version) => version.number === this.state.selectedEventVersionNumber)
      .maps
      .concat({source: "", target: ""});
    const list = [];
    for (let mapIndex = 0; mapIndex < maps.length; mapIndex++) {
      const map = maps[mapIndex];
      const item = <li key={mapIndex}>
        <input
          value={map.source}
          autoFocus={"source" + mapIndex === this.state.mapInputSelected}
          onChange={(e) => this.changeMap("source", mapIndex, e.target.value)}/>
        <img src="/resources/icons/arrow-map-right-hollow.svg" alt="maps to" />
        <input
          value={map.target}
          autoFocus={"target" + mapIndex === this.state.mapInputSelected}
          onChange={(e) => this.changeMap("target", mapIndex, e.target.value)}/>
      </li>;
      list.push(item);
    }
    return list;
  }

  render() {
    const versionsToRender = this.getVersionsToRender();
    const doDisplayPreviousVersionSelector = this.doDisplayPreviousVersionSelector(
      versionsToRender
    );
    const doDisplayNextVersionSelector = this.doDisplayNextVersionSelector(
      versionsToRender
    );
    return <div className={this.props.className + " event"}>
      <div className="actions">
        <button onClick={() => this.copyVersion()}>copy</button>
        <button onClick={() => this.props.onEventSaved(this.state.event)}>save</button>
      </div>
      <div className="versions">
        <h6>versions</h6>
        <div className="segmented-control">
          <button
            disabled={!doDisplayPreviousVersionSelector}
            onClick={() => this.selectPreviousVersion()}>
            <img src="/resources/icons/arrow-backward.svg" alt="previous"/>
          </button>
          {
            versionsToRender.map((number) => {
              return <button
                key={number}
                className={number === this.state.selectedEventVersionNumber
                  ? "selected"
                  : undefined}
                onClick={() => this.selectVersion(number)}>
                <span>V{number}</span>
              </button>;
            })
          }
          <button
            disabled={!doDisplayNextVersionSelector}
            onClick={() => this.selectNextVersion()}>
            <img src="/resources/icons/arrow-forward.svg" alt="next"/>
          </button>
        </div>
      </div>
      <div className="maps">
        <ul>
          <li>
            <h6>event property</h6>
            <h6>context property</h6>
          </li>
          {this.renderMaps()}
        </ul>
      </div>
    </div>;
  }
}
Event.propTypes = {
  event: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  onEventSaved: PropTypes.func.isRequired
};

export default Event;
