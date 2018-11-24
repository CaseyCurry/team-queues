import React from "react";
import PropTypes from "prop-types";
import Lifecycle from "./Lifecycle";

const countToDisplay = 30;

class List extends React.Component {
  constructor(props) {
    super(props);
    const filteredLifecycles = this.filter(
      this.props.searchString
    );
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
        this
          .props
          .onLifecycleSelected(selectedLifecycle);
      }
    }
    return {
      filteredLifecycles,
      selectedLifecycle,
      searchString
    };
  }

  selectLifecycle(selectedLifecycle) {
    if (selectedLifecycle.isNew) {
      selectedLifecycle = Object.assign({}, selectedLifecycle, {
        lifecycleOf: ""
      });
    }
    this
      .props
      .onLifecycleSelected(selectedLifecycle);
    if (!this.props.hasNextVersionBeenModified) {
      this.setState(Object.assign({}, this.state, { selectedLifecycle }));
    }
  }

  changeLifecycleOf(lifecycleOf) {
    const selectedLifecycle = Object.assign({}, this.state.selectedLifecycle, { lifecycleOf });
    this.setState(Object.assign({}, this.state, { selectedLifecycle }));
    this
      .props
      .onLifecycleOfChanged(lifecycleOf);
  }

  render() {
    const lifecycleToAdd = {
      lifecycleOf: "+ LIFECYCLE",
      previousVerion: null,
      activeVersion: null,
      nextVersion: this.props.defaultVersionCreator(),
      isNew: true
    };
    return (
      <div className={this.props.className + " vertical-tabs list"}>
        <div className="filter">
          <div className="search">
            <input
              placeholder="search"
              value={this.state.searchString ? this.state.searchString : ""}
              onChange={(e) => this.search(e.target.value)} />
          </div>
        </div>
        <ul>
          {
            [lifecycleToAdd]
              .concat(this
                .state
                .filteredLifecycles
                .slice(0, countToDisplay))
              .map((lifecycle) => {
                let itemValue;
                const lifecycleBeingAdded = lifecycle.isNew && this.props.isAddingLifecycle;
                let className = this.state.selectedLifecycle && this.state.selectedLifecycle.lifecycleOf === lifecycle.lifecycleOf || lifecycleBeingAdded ?
                  "selected" : "unselected";
                if (lifecycleBeingAdded) {
                  itemValue =
                    <input
                      autoFocus="autoFocus"
                      placeholder="lifecycle of"
                      value={this.state.selectedLifecycle.lifecycleOf}
                      onChange={(e) => this.changeLifecycleOf(e.target.value)}
                      onClick={(e) => e.stopPropagation()} />;
                } else {
                  itemValue = lifecycle.lifecycleOf;
                }
                return <li
                  key={lifecycle.lifecycleOf}
                  className={className}
                  title={lifecycle.lifecycleOf}
                  onClick={() => this.selectLifecycle(lifecycle)}>
                  <span>{itemValue}</span>
                  {
                    (this.state.selectedLifecycle === lifecycle || this.state.selectedLifecycle && this.state.selectedLifecycle.isNew && lifecycle.isNew) &&
                    <Lifecycle
                      className="d-block d-md-none col-12"
                      lifecycle={this.state.selectedLifecycle}
                      doPromptToSaveChanges={this.props.doPromptToSaveChanges}
                      isNextVersionSaving={this.props.isNextVersionSaving}
                      isNextVersionActivating={this.props.isNextVersionActivating}
                      onNextVersionSaved={this.props.onNextVersionSaved}
                      onNextVersionActivated={this.props.onNextVersionActivated}
                      onNextVersionSaveValidationFailed={this.props.onNextVersionSaveValidationFailed}
                      onNextVersionModified={this.props.onNextVersionModified} />
                  }
                </li>;
              })
          }
        </ul>
      </div>
    );
  }
}

List.propTypes = {
  className: PropTypes.string.isRequired,
  lifecycles: PropTypes.array.isRequired,
  isAddingLifecycle: PropTypes.bool,
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

export default List;
