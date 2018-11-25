import React from "react";
import PropTypes from "prop-types";
import Loader from "../../../../controls/Loader";

class Event extends React.Component {
  renderMaps() {
    // TODO: implement a better UX when adding an event by using tabindex
    const maps = this
      .props
      .event
      .versions
      .find((version) => version.number === this.props.selectedEventVersionNumber)
      .maps
      .concat({
        source: "",
        target: ""
      });
    const list = [];
    for (let mapIndex = 0; mapIndex < maps.length; mapIndex++) {
      const map = maps[mapIndex];
      const item =
        <li key={mapIndex} className="map">
          <input
            value={map.source}
            autoFocus={"source" + mapIndex === this.props.selectedMap}
            onChange={(e) => {
              this.props.onMapModified("source", mapIndex, e.target.value);
              e.stopPropagation();
            }} />
          <img src="/resources/icons/arrow-map-right-hollow.svg" alt="maps to" />
          <input
            value={map.target}
            autoFocus={"target" + mapIndex === this.props.selectedMap}
            onChange={(e) => {
              this.props.onMapModified("target", mapIndex, e.target.value);
              e.stopPropagation();
            }} />
        </li>;
      list.push(item);
    }
    return list;
  }

  render() {
    return <div className={this.props.className + " workspace event"}>
      <div className="event-level-data">
        <label className="checkbox">active
          <input
            type="checkbox"
            checked={!!this.props.event.isActive}
            onChange={(e) => {
              this.props.onActiveStateToggled();
              e.stopPropagation();
            }} />
          <span className="checkmark"></span>
        </label>
      </div>
      <div className="area">
        <div className="versions">
          <div className="segmented-control">
            <button
              className="selector"
              disabled={!this.props.doDisplayPreviousVersionSelector}
              onClick={(e) => {
                this.props.onPreviousVersionSelected();
                e.stopPropagation();
              }}
              title="previous version">
              <img src="/resources/icons/arrow-backward.svg" alt="previous" />
            </button>
            <button key={this.props.selectedEventVersionNumber} className="primary">
              <span>V{this.props.selectedEventVersionNumber}</span>
            </button>
            <button
              className="secondary"
              onClick={(e) => {
                this.props.onVersionCopied();
                e.stopPropagation();
              }}
              title="copy version">+</button>
            <button
              className="selector"
              disabled={!this.props.doDisplayNextVersionSelector}
              onClick={(e) => {
                this.props.onNextVersionSelected();
                e.stopPropagation();
              }}
              title="next version">
              <img src="/resources/icons/arrow-forward.svg" alt="next" />
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
      </div>
      <div className="actions">
        {
          this.props.isSaving &&
          <button>
            saving
            <Loader />
          </button>
        }
        {
          !this.props.isSaving &&
          <button onClick={(e) => {
            this.props.onSaved(this.props.event);
            e.stopPropagation();
          }}>
            save
          </button>
        }
        <button onClick={(e) => {
          this.props.onCancelled();
          e.stopPropagation();
        }}>cancel</button>
      </div>
    </div>;
  }
}

Event.propTypes = {
  event: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  selectedEventVersionNumber: PropTypes.number.isRequired,
  selectedMap: PropTypes.string,
  doDisplayPreviousVersionSelector: PropTypes.bool.isRequired,
  doDisplayNextVersionSelector: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onSaved: PropTypes.func.isRequired,
  onCancelled: PropTypes.func.isRequired,
  onMapModified: PropTypes.func.isRequired,
  onActiveStateToggled: PropTypes.func.isRequired,
  onPreviousVersionSelected: PropTypes.func.isRequired,
  onNextVersionSelected: PropTypes.func.isRequired,
  onVersionCopied: PropTypes.func.isRequired
};

export default Event;
