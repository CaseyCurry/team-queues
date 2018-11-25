import React from "react";
import PropTypes from "prop-types";
import Loader from "../../../../controls/Loader";

class Lifecycle extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    let selectedVersion;
    if (this.props.lifecycle.nextVersion && !this.props.lifecycle.nextVersion.isNew) {
      selectedVersion = this.props.lifecycle.nextVersion;
    } else if (this.props.lifecycle.nextVersion && !this.props.lifecycle.activeVersion && !this.props.lifecycle.previousVersion) {
      selectedVersion = this.props.lifecycle.nextVersion;
    } else if (this.props.lifecycle.activeVersion) {
      selectedVersion = this.props.lifecycle.activeVersion;
    } else {
      selectedVersion = this.props.lifecycle.previousVersion;
    }
    return {
      lifecycle: this.props.lifecycle,
      selectedVersion,
      triggerDefinition: null,
      isTriggerDefinitionValid: true,
      queueDefinition: null,
      isQueueDefinitionValid: true
    };
  }

  componentDidUpdate(previousProps) {
    if (this.props.lifecycle !== previousProps.lifecycle) {
      this.setState(this.getInitialState());
    }
  }

  cancel() {
    this.setState(this.getInitialState());
    const hasNextVersionBeenModified = false;
    this.props.onNextVersionModified(hasNextVersionBeenModified);
  }

  selectVersion(selectedVersion) {
    if (selectedVersion === this.state.selectedVersion) {
      return;
    }
    this.setState(Object.assign({}, this.state, {
      selectedVersion,
      isTriggerDefinitionValid: true,
      isQueueDefinitionValid: true
    }));
  }

  validateTriggers() {
    try {
      JSON.parse(this.state.triggerDefinition);
      this.setState(Object.assign({}, this.state, {
        isTriggerDefinitionValid: true
      }));
    } catch (error) {
      this.setState(Object.assign({}, this.state, {
        isTriggerDefinitionValid: false
      }));
    }
  }

  validateQueues() {
    try {
      JSON.parse(this.state.queueDefinition);
      this.setState(Object.assign({}, this.state, {
        isQueueDefinitionValid: true
      }));
    } catch (error) {
      this.setState(Object.assign({}, this.state, {
        isQueueDefinitionValid: false
      }));
    }
  }

  changeTriggers(triggerDefinition) {
    this.setState(Object.assign({}, this.state, { triggerDefinition }));
  }

  changeQueues(queueDefinition) {
    this.setState(Object.assign({}, this.state, { queueDefinition }));
  }

  saveChanges(e) {
    let isTriggerDefinitionValid = true;
    let isQueueDefinitionValid = true;
    let triggers;
    let queues;

    try {
      triggers = this.state.triggerDefinition !== null ?
        JSON.parse(this.state.triggerDefinition) : this.state.lifecycle.nextVersion.triggersForItemCreation;
    } catch (error) {
      isTriggerDefinitionValid = false;
    }

    try {
      queues = this.state.queueDefinition !== null ?
        JSON.parse(this.state.queueDefinition) : this.state.lifecycle.nextVersion.queues;
    } catch (error) {
      isQueueDefinitionValid = false;
    }

    if (!isTriggerDefinitionValid || !isQueueDefinitionValid) {
      this.setState(Object.assign({}, this.state, {
        isTriggerDefinitionValid,
        isQueueDefinitionValid
      }));
      this.props.onNextVersionSaveValidationFailed("invalid json caused the save to fail");
      e.stopPropagation();
      return;
    }

    const lifecycle = JSON.parse(JSON.stringify(this.state.lifecycle));
    lifecycle.nextVersion.triggersForItemCreation = triggers;
    lifecycle.nextVersion.queues = queues;
    this.setState(Object.assign({}, this.state, {
      lifecycle,
      selectedVersion: lifecycle.nextVersion,
      triggerDefinition: null,
      isTriggerDefinitionValid: true,
      queueDefinition: null,
      isQueueDefinitionValid: true
    }));
    this.props.onNextVersionSaved(lifecycle);
  }

  hasNextVersionBeenModified() {
    if (!this.state) {
      return false;
    }

    try {
      // parse then stringify to avoid formatting differences
      const currentTriggerDefinition = this.state.triggerDefinition === null ?
        JSON.stringify(this.state.lifecycle.nextVersion.triggersForItemCreation) : JSON.stringify(JSON.parse(this.state.triggerDefinition));
      const currentQueueDefinition = this.state.queueDefinition === null ?
        JSON.stringify(this.state.lifecycle.nextVersion.queues) : JSON.stringify(JSON.parse(this.state.queueDefinition));
      const originalTriggerDefinition = JSON.stringify(this.props.lifecycle.nextVersion.triggersForItemCreation);
      const originalQueueDefinition = JSON.stringify(this.props.lifecycle.nextVersion.queues);
      return currentTriggerDefinition !== originalTriggerDefinition ||
        currentQueueDefinition !== originalQueueDefinition;
    } catch (error) {
      // if there is invalid json, then something has changed
      return true;
    }
  }

  leaveTriggers() {
    if (!this.state.isTriggerDefinitionValid) {
      this.validateTriggers();
    }
    this.props.onNextVersionModified(this.hasNextVersionBeenModified());
  }

  leaveQueues() {
    if (!this.state.isQueueDefinitionValid) {
      this.validateQueues();
    }
    this.props.onNextVersionModified(this.hasNextVersionBeenModified());
  }

  render() {
    const isActiveSelected = this.state.lifecycle.activeVersion === this.state.selectedVersion;
    const isPreviousSelected = this.state.lifecycle.previousVersion === this.state.selectedVersion;
    const isNextSelected = this.state.lifecycle.nextVersion === this.state.selectedVersion;
    const hasNextVersionBeenModified = this.hasNextVersionBeenModified();
    const saveButton = <button
      disabled={!hasNextVersionBeenModified || !isNextSelected}
      onClick={(e) => this.saveChanges(e)}>
      save
    </button>;
    const cancelButton = <button
      disabled={!hasNextVersionBeenModified || !isNextSelected}
      onClick={() => this.cancel()}>
      cancel
    </button>;
    return <div className={this.props.className + " workspace lifecycle"}>
      <div className="area">
        <div className="versions">
          <div className="segmented-control">
            <button
              className={isPreviousSelected ? "selected" : "unselected"}
              disabled={!this.state.lifecycle.previousVersion}
              onClick={() => this.selectVersion(this.state.lifecycle.previousVersion)}
              title="previous version">
              previous
            </button>
            <button
              className={isActiveSelected ? "selected" : "unselected"}
              disabled={!this.state.lifecycle.activeVersion}
              onClick={() => this.selectVersion(this.state.lifecycle.activeVersion)}
              title="active version">
              active
            </button>
            <button
              className={isNextSelected ? "selected" : "unselected"}
              disabled={!this.state.lifecycle.nextVersion}
              onClick={() => this.selectVersion(this.state.lifecycle.nextVersion)}
              title="next version">
              next
            </button>
          </div>
        </div>
        <div className="definition">
          <h6>triggers</h6>
          {
            isNextSelected &&
            <textarea
              className={!this.state.isTriggerDefinitionValid ? "error" : undefined}
              value={this.state.triggerDefinition !== null ? this.state.triggerDefinition : JSON.stringify(this.state.selectedVersion.triggersForItemCreation, null, 4)}
              onChange={(e) => this.changeTriggers(e.target.value)}
              onBlur={() => this.leaveTriggers()}>
            </textarea>
          }
          {
            !isNextSelected &&
            <textarea disabled defaultValue={JSON.stringify(this.state.selectedVersion.triggersForItemCreation, null, 4)}></textarea>
          }
          <h6>queues</h6>
          {
            isNextSelected &&
            <textarea
              className={!this.state.isQueueDefinitionValid ? "error" : undefined}
              value={this.state.queueDefinition !== null ? this.state.queueDefinition : JSON.stringify(this.state.selectedVersion.queues, null, 4)}
              onChange={(e) => this.changeQueues(e.target.value)}
              onBlur={() => this.leaveQueues()}>
            </textarea>
          }
          {
            !isNextSelected &&
            <textarea disabled defaultValue={JSON.stringify(this.state.selectedVersion.queues, null, 4)}></textarea>
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
            disabled={hasNextVersionBeenModified || !isNextSelected}
            onClick={() => this.props.onNextVersionActivated(this.state.lifecycle)}>
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
  isNextVersionSaving: PropTypes.bool.isRequired,
  isNextVersionActivating: PropTypes.bool.isRequired,
  doPromptToSaveChanges: PropTypes.bool.isRequired,
  onNextVersionSaved: PropTypes.func.isRequired,
  onNextVersionActivated: PropTypes.func.isRequired,
  onNextVersionSaveValidationFailed: PropTypes.func.isRequired,
  onNextVersionModified: PropTypes.func.isRequired
};

export default Lifecycle;
