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
  }

  selectVersion(selectedVersion) {
    if (selectedVersion === this.state.selectedVersion) {
      return true;
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

  saveChanges() {
    const nextVersion = Object.assign({}, this.state.selectedVersion);
    let isTriggerDefinitionValid = true;
    let isQueueDefinitionValid = true;

    try {
      nextVersion.triggersForItemCreation = JSON.parse(this.state.triggerDefinition);
    } catch (error) {
      isTriggerDefinitionValid = false;
    }

    try {
      nextVersion.queues = JSON.parse(this.state.queueDefinition);
    } catch (error) {
      isQueueDefinitionValid = false;
    }

    if (!isTriggerDefinitionValid || !isQueueDefinitionValid) {
      this.setState(Object.assign({}, this.state, {
        isTriggerDefinitionValid,
        isQueueDefinitionValid
      }));
      this.props.onNextVersionSaveValidationFailed("invalid json caused the save to fail");
      return;
    }

    const lifecycle = JSON.parse(JSON.stringify(this.state.lifecycle));
    lifecycle.nextVersion = nextVersion;
    this.setState(Object.assign({}, this.state, {
      lifecycle,
      selectedVersion: nextVersion,
      triggerDefinition: null,
      isTriggerDefinitionValid: true,
      queueDefinition: null,
      isQueueDefinitionValid: true
    }));
    this.props.onNextVersionSaved(this.state.lifecycle);
  }

  hasNextVersionChanged() {
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

  render() {
    // TODO: add warning before losing changes
    const isActiveSelected = this.state.lifecycle.activeVersion === this.state.selectedVersion;
    const isPreviousSelected = this.state.lifecycle.previousVersion === this.state.selectedVersion;
    const isNextSelected = this.state.lifecycle.nextVersion === this.state.selectedVersion;
    const hasNextVersionChanged = this.hasNextVersionChanged();
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
              onBlur={!this.state.isTriggerDefinitionValid ? () => this.validateTriggers() : undefined}>
            </textarea>
          }
          {
            !isNextSelected &&
            <textarea disabled defaultValue={JSON.stringify(this.state.selectedVersion.triggersForItemCreation, null, 4)}></textarea>
          }
          {
            isNextSelected &&
            <textarea
              className={!this.state.isQueueDefinitionValid ? "error" : undefined}
              value={this.state.queueDefinition !== null ? this.state.queueDefinition : JSON.stringify(this.state.selectedVersion.queues, null, 4)}
              onChange={(e) => this.changeQueues(e.target.value)}
              onBlur={!this.state.isQueueDefinitionValid ? () => this.validateQueues() : undefined}>
            </textarea>
          }
          {
            !isNextSelected &&
            <textarea disabled defaultValue={JSON.stringify(this.state.selectedVersion.queues, null, 4)}></textarea>
          }
        </div>
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
          <button
            disabled={!hasNextVersionChanged || !isNextSelected}
            onClick={() => this.saveChanges()}>
            save
          </button>
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
            disabled={hasNextVersionChanged || !isNextSelected}
            onClick={() => this.props.onNextVersionActivated(this.state.lifecycle)}>
            activate
          </button>
        }
        <button
          disabled={!hasNextVersionChanged || !isNextSelected}
          onClick={() => this.cancel()}>
          cancel
        </button>
      </div>
    </div>;
  }
}

Lifecycle.propTypes = {
  lifecycle: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  isNextVersionSaving: PropTypes.bool.isRequired,
  isNextVersionActivating: PropTypes.bool.isRequired,
  onNextVersionSaved: PropTypes.func.isRequired,
  onNextVersionActivated: PropTypes.func.isRequired,
  onNextVersionSaveValidationFailed: PropTypes.func.isRequired
};

export default Lifecycle;
