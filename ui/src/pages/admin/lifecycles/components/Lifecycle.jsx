import React from "react";
import PropTypes from "prop-types";
import Loader from "../../../../controls/Loader";

class Lifecycle extends React.Component {
  render() {
    const saveButton = <button
      disabled={!this.props.hasNextVersionBeenModified || !this.props.isNextSelected}
      onClick={(e) => {
        this.props.onNextVersionSaved(e);
        e.stopPropagation();
      }}>
      save
    </button>;
    const cancelButton = <button
      disabled={!this.props.hasNextVersionBeenModified || !this.props.isNextSelected}
      onClick={(e) => {
        this.props.onNextVersionModificationsCancelled();
        e.stopPropagation();
      }}>
      cancel
    </button>;
    return <div className={this.props.className + " workspace lifecycle"}>
      <div className="area">
        <div className="versions">
          <div className="segmented-control">
            <button
              className={this.props.isPreviousSelected ? "selected" : "unselected"}
              disabled={!this.props.lifecycle.previousVersion}
              onClick={(e) => {
                this.props.onVersionSelected(this.props.lifecycle.previousVersion);
                e.stopPropagation();
              }}
              title="previous version">
              previous
            </button>
            <button
              className={this.props.isActiveSelected ? "selected" : "unselected"}
              disabled={!this.props.lifecycle.activeVersion}
              onClick={(e) => {
                this.props.onVersionSelected(this.props.lifecycle.activeVersion);
                e.stopPropagation();
              }}
              title="active version">
              active
            </button>
            <button
              className={this.props.isNextSelected ? "selected" : "unselected"}
              disabled={!this.props.lifecycle.nextVersion}
              onClick={(e) => {
                this.props.onVersionSelected(this.props.lifecycle.nextVersion);
                e.stopPropagation();
              }}
              title="next version">
              next
            </button>
          </div>
        </div>
        <div className="definition">
          <h6>triggers</h6>
          {
            this.props.isNextSelected &&
            <textarea
              className={!this.props.isTriggerDefinitionValid ? "error" : undefined}
              value={this.props.triggerDefinition !== null ? this.props.triggerDefinition : JSON.stringify(this.props.selectedVersion.triggersForItemCreation, null, 4)}
              onChange={(e) => {
                this.props.onTriggerModified(e.target.value);
                e.stopPropagation();
              }}
              onBlur={(e) => {
                this.props.onTriggerExited();
                e.stopPropagation();
              }}>
            </textarea>
          }
          {
            !this.props.isNextSelected &&
            <textarea disabled defaultValue={JSON.stringify(this.props.selectedVersion.triggersForItemCreation, null, 4)}></textarea>
          }
          <h6>queues</h6>
          {
            this.props.isNextSelected &&
            <textarea
              className={!this.props.isQueueDefinitionValid ? "error" : undefined}
              value={this.props.queueDefinition !== null ? this.props.queueDefinition : JSON.stringify(this.props.selectedVersion.queues, null, 4)}
              onChange={(e) => {
                this.props.onQueueModified(e.target.value);
                e.stopPropagation();
              }}
              onBlur={(e) => {
                this.props.onQueueExited();
                e.stopPropagation();
              }}>
            </textarea>
          }
          {
            !this.props.isNextSelected &&
            <textarea disabled defaultValue={JSON.stringify(this.props.selectedVersion.queues, null, 4)}></textarea>
          }
        </div>
        {
          this.props.doPromptToSaveChanges &&
          <div className="dialog">
            <div>
              <div>Do you want to save your changes?</div>
              {saveButton}
              {cancelButton}
            </div>
          </div>
        }
      </div>
      <div className="actions">
        {
          this.props.isNextVersionSaving &&
          <button>
            saving
            <Loader />
          </button>
        }
        {
          !this.props.isNextVersionSaving &&
          saveButton
        }
        {
          this.props.isNextVersionActivating &&
          <button>
            activating
            <Loader />
          </button>
        }
        {
          !this.props.isNextVersionActivating &&
          <button
            disabled={this.props.hasNextVersionBeenModified || !this.props.isNextSelected}
            onClick={() => this.props.onNextVersionActivated(this.props.lifecycle)}>
            activate
          </button>
        }
        {cancelButton}
      </div>
    </div>;
  }
}

Lifecycle.propTypes = {
  lifecycle: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  selectedVersion: PropTypes.object.isRequired,
  hasNextVersionBeenModified: PropTypes.bool.isRequired,
  isNextSelected: PropTypes.bool.isRequired,
  isPreviousSelected: PropTypes.bool.isRequired,
  isActiveSelected: PropTypes.bool.isRequired,
  triggerDefinition: PropTypes.string,
  isTriggerDefinitionValid: PropTypes.bool.isRequired,
  queueDefinition: PropTypes.string,
  isQueueDefinitionValid: PropTypes.bool.isRequired,
  isNextVersionSaving: PropTypes.bool.isRequired,
  isNextVersionActivating: PropTypes.bool.isRequired,
  doPromptToSaveChanges: PropTypes.bool.isRequired,
  onVersionSelected: PropTypes.func.isRequired,
  onNextVersionSaved: PropTypes.func.isRequired,
  onNextVersionModificationsCancelled: PropTypes.func.isRequired,
  onTriggerModified: PropTypes.func.isRequired,
  onTriggerExited: PropTypes.func.isRequired,
  onQueueModified: PropTypes.func.isRequired,
  onQueueExited: PropTypes.func.isRequired,
  onNextVersionActivated: PropTypes.func.isRequired
};

export default Lifecycle;
