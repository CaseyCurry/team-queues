import React from "react";
import PropTypes from "prop-types";
import Lifecycle from "./Lifecycle";

class LifecycleContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    let selectedVersion;
    if (this.props.lifecycle.nextVersion) {
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

  save(e) {
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

  modifyTriggers(triggerDefinition) {
    this.setState(Object.assign({}, this.state, { triggerDefinition }));
  }

  modifyQueues(queueDefinition) {
    this.setState(Object.assign({}, this.state, { queueDefinition }));
  }

  exitTriggers() {
    if (!this.state.isTriggerDefinitionValid) {
      this.validateTriggers();
    }
    this.props.onNextVersionModified(this.hasNextVersionBeenModified());
  }

  exitQueues() {
    if (!this.state.isQueueDefinitionValid) {
      this.validateQueues();
    }
    this.props.onNextVersionModified(this.hasNextVersionBeenModified());
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

  render() {
    return <Lifecycle
      lifecycle={this.state.lifecycle}
      className={this.props.className}
      selectedVersion={this.state.selectedVersion}
      hasNextVersionBeenModified={this.hasNextVersionBeenModified()}
      isNextSelected={this.state.lifecycle.nextVersion === this.state.selectedVersion}
      isPreviousSelected={this.state.lifecycle.previousVersion === this.state.selectedVersion}
      isActiveSelected={this.state.lifecycle.activeVersion === this.state.selectedVersion}
      triggerDefinition={this.state.triggerDefinition}
      isTriggerDefinitionValid={this.state.isTriggerDefinitionValid}
      queueDefinition={this.state.queueDefinition}
      isQueueDefinitionValid={this.state.isQueueDefinitionValid}
      isNextVersionSaving={this.props.isNextVersionSaving}
      isNextVersionActivating={this.props.isNextVersionActivating}
      doPromptToSaveChanges={this.props.doPromptToSaveChanges}
      onVersionSelected={this.selectVersion.bind(this)}
      onNextVersionSaved={this.save.bind(this)}
      onNextVersionModificationsCancelled={this.cancel.bind(this)}
      onTriggerModified={this.modifyTriggers.bind(this)}
      onTriggerExited={this.exitTriggers.bind(this)}
      onQueueModified={this.modifyQueues.bind(this)}
      onQueueExited={this.exitQueues.bind(this)}
      onNextVersionActivated={this.props.onNextVersionActivated}
    />;
  }
}

LifecycleContainer.propTypes = {
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

export default LifecycleContainer;
