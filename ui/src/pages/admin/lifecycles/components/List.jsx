import React from "react";
import PropTypes from "prop-types";
import uuidv4 from "uuid/v4";
import Lifecycle from "./Lifecycle";

const countToDisplay = 30;

class List extends React.Component {
  constructor(props) {
    super(props);
    // TODO: Is active/inactive the best characteristic or is active/inactive/WIP better?
    const onlyIncludeActiveLifecycles = true;
    const filteredLifecycles = this.filter(
      this.props.searchString,
      onlyIncludeActiveLifecycles
    );
    this.state = Object.assign({}, filteredLifecycles);
  }

  search(searchString) {
    const filteredLifecycles = this.filter(
      searchString,
      this.state.onlyIncludeActiveLifecycles
    );
    this.setState(Object.assign({}, this.state, filteredLifecycles));
  }

  filter(searchString, onlyIncludeActiveLifecycles) {
    let filteredLifecycles = this.props.lifecycles && searchString ?
      this
        .props
        .lifecycles
        .filter((lifecycle) => lifecycle.displayName().toLowerCase().includes(searchString.toLowerCase()))
      : this.props.lifecycles;
    if (onlyIncludeActiveLifecycles) {
      filteredLifecycles = filteredLifecycles.filter((lifecycle) => lifecycle.isActive);
    }
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
      searchString,
      onlyIncludeActiveLifecycles
    };
  }

  toggleInclusionOfActiveLifecycles() {
    const filteredLifecycles = this.filter(this.state.searchString, !this.state.onlyIncludeActiveLifecycles);
    this.setState(Object.assign({}, this.state, filteredLifecycles));
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
    this.setState(Object.assign({}, this.state, { selectedLifecycle }));
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
      id: uuidv4(),
      lifecycleOf: "+ LIFECYCLE",
      displayName: () => "+ LIFECYCLE",
      version: 1,
      isActive: false,
      triggersForItemCreation: [],
      queues: [],
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
          <div className="inactives">
            <label className="checkbox">
              <span>only include active lifecycles</span>
              <input
                type="checkbox"
                checked={this.state.onlyIncludeActiveLifecycles}
                onChange={() => this.toggleInclusionOfActiveLifecycles()} />
              <span className="checkmark"></span>
            </label>
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
                if (!lifecycle.isActive && !lifecycle.isNew) {
                  className = className + " inactive";
                }
                if (lifecycleBeingAdded) {
                  itemValue =
                    <input
                      autoFocus="autoFocus"
                      placeholder="lifecycle of"
                      value={this.state.selectedLifecycle.lifecycleOf}
                      onChange={(e) => this.changeLifecycleOf(e.target.value)}
                      onClick={(e) => e.stopPropagation()} />;
                } else {
                  itemValue = lifecycle.displayName();
                }
                return <li
                  key={lifecycle.id}
                  className={className}
                  title={`${lifecycle.displayName()} ${lifecycle.id}`}
                  onClick={() => this.selectLifecycle(lifecycle)}>
                  <span>{itemValue}</span>
                  {
                    (this.state.selectedLifecycle === lifecycle || this.state.selectedLifecycle && this.state.selectedLifecycle.isNew && lifecycle.isNew) &&
                    <Lifecycle
                      className="d-block d-md-none col-12"
                      lifecycle={this.state.selectedLifecycle}
                      onLifecycleSaved={this.props.onLifecycleSaved}
                      isLifecycleSaving={this.props.isLifecycleSaving} />
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
  isLifecycleSaving: PropTypes.bool.isRequired,
  onLifecycleSelected: PropTypes.func.isRequired,
  onLifecycleOfChanged: PropTypes.func.isRequired,
  onLifecycleSaved: PropTypes.func.isRequired
};

export default List;
