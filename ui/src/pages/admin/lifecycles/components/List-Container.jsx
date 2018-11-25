import React from "react";
import PropTypes from "prop-types";
import List from "./List";

const countToDisplay = 30;

class ListContainer extends React.Component {
  constructor(props) {
    super(props);
    const filteredLifecycles = this.filter(props.searchString);
    this.state = Object.assign({}, filteredLifecycles);
  }

  search(searchString) {
    const filteredLifecycles = this.filter(searchString);
    if (this.props.hasNextVersionBeenModified) {
      return;
    }
    this.setState(Object.assign({}, this.state, filteredLifecycles));
  }

  filter(searchString) {
    let filteredLifecycles = this.props.lifecycles && searchString ?
      this
        .props
        .lifecycles
        .filter((lifecycle) => lifecycle.lifecycleOf.toLowerCase().includes(searchString.toLowerCase()))
      : this.props.lifecycles;
    const selectedLifecycle = filteredLifecycles.length ? filteredLifecycles[0] : null;
    if (selectedLifecycle) {
      if (!this.state || selectedLifecycle !== this.state.selectedLifecycle) {
        this.props.onLifecycleSelected(selectedLifecycle);
      }
    }
    return {
      filteredLifecycles,
      selectedLifecycle,
      searchString
    };
  }

  select(selectedLifecycle) {
    if (selectedLifecycle.isNew) {
      selectedLifecycle = Object.assign({}, selectedLifecycle, {
        lifecycleOf: ""
      });
    }
    this.props.onLifecycleSelected(selectedLifecycle);
    if (!this.props.hasNextVersionBeenModified) {
      this.setState(Object.assign({}, this.state, { selectedLifecycle }));
    }
  }

  changeLifecycleOf(lifecycleOf) {
    const selectedLifecycle = Object.assign({}, this.state.selectedLifecycle, { lifecycleOf });
    this.setState(Object.assign({}, this.state, { selectedLifecycle }));
    this.props.onLifecycleOfChanged(lifecycleOf);
  }

  render() {
    const lifecycleToAdd = {
      lifecycleOf: "+ LIFECYCLE",
      previousVerion: null,
      activeVersion: null,
      nextVersion: this.props.defaultVersionCreator(),
      isNew: true
    };
    const lifecycles = [lifecycleToAdd]
      .concat(this
        .state
        .filteredLifecycles
        .slice(0, countToDisplay));
    return <List
      className={this.props.className}
      lifecycles={lifecycles}
      selectedLifecycle={this.state.selectedLifecycle}
      isLifecycleBeingAdded={this.props.isLifecycleBeingAdded}
      searchString={this.state.searchString}
      isNextVersionSaving={this.props.isNextVersionSaving}
      isNextVersionActivating={this.props.isNextVersionActivating}
      doPromptToSaveChanges={this.props.doPromptToSaveChanges}
      onLifecycleSelected={this.select.bind(this)}
      onLifecycleOfChanged={this.changeLifecycleOf.bind(this)}
      onNextVersionSaved={this.props.onNextVersionSaved}
      onNextVersionActivated={this.props.onNextVersionActivated}
      onNextVersionSaveValidationFailed={this.props.onNextVersionSaveValidationFailed}
      onNextVersionModified={this.props.onNextVersionModified}
      onSearch={this.search.bind(this)} />;
  }
}

ListContainer.propTypes = {
  className: PropTypes.string.isRequired,
  lifecycles: PropTypes.array.isRequired,
  isLifecycleBeingAdded: PropTypes.bool.isRequired,
  searchString: PropTypes.string,
  isNextVersionSaving: PropTypes.bool.isRequired,
  isNextVersionActivating: PropTypes.bool.isRequired,
  defaultVersionCreator: PropTypes.func.isRequired,
  hasNextVersionBeenModified: PropTypes.bool.isRequired,
  doPromptToSaveChanges: PropTypes.bool.isRequired,
  onLifecycleSelected: PropTypes.func.isRequired,
  onLifecycleOfChanged: PropTypes.func.isRequired,
  onNextVersionSaved: PropTypes.func.isRequired,
  onNextVersionActivated: PropTypes.func.isRequired,
  onNextVersionSaveValidationFailed: PropTypes.func.isRequired,
  onNextVersionModified: PropTypes.func.isRequired
};

export default ListContainer;
