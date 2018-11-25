import React from "react";
import PropTypes from "prop-types";
import LifecycleContainer from "./Lifecycle-Container";

class List extends React.Component {
  render() {
    return (
      <div className={this.props.className + " vertical-tabs list"}>
        <div className="filter">
          <div className="search">
            <input
              placeholder="search"
              value={this.props.searchString ? this.props.searchString : ""}
              onChange={(e) => {
                this.props.onSearch(e.target.value);
                e.stopPropagation();
              }} />
          </div>
        </div>
        <ul>
          {
            this
              .props
              .lifecycles
              .map((lifecycle) => {
                let itemValue;
                const isThisLifecycleBeingAdded = lifecycle.isNew && this.props.isLifecycleBeingAdded;
                const isThisLifecycleSelected = this.props.selectedLifecycle && this.props.selectedLifecycle.lifecycleOf === lifecycle.lifecycleOf;
                let className = isThisLifecycleSelected || isThisLifecycleBeingAdded ?
                  "selected" : "unselected";
                if (isThisLifecycleBeingAdded) {
                  itemValue =
                    <input
                      autoFocus="autoFocus"
                      placeholder="lifecycle of"
                      value={this.props.selectedLifecycle.lifecycleOf}
                      onChange={(e) => {
                        this.props.onLifecycleOfChanged(e.target.value);
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        /* This prevents the event from bubbling up to the list when 
                           the lifecycle is rendered underneath the li on a small device. */
                        e.stopPropagation();
                      }} />;
                } else {
                  itemValue = lifecycle.lifecycleOf;
                }
                return <li
                  key={lifecycle.lifecycleOf}
                  className={className}
                  title={lifecycle.lifecycleOf}
                  onClick={(e) => {
                    this.props.onLifecycleSelected(lifecycle);
                    e.stopPropagation();
                  }}>
                  <span>{itemValue}</span>
                  {
                    (isThisLifecycleSelected || isThisLifecycleBeingAdded) &&
                    <LifecycleContainer
                      className="d-block d-md-none col-12"
                      lifecycle={this.props.selectedLifecycle}
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
  selectedLifecycle: PropTypes.object,
  isLifecycleBeingAdded: PropTypes.bool,
  searchString: PropTypes.string,
  isNextVersionSaving: PropTypes.bool.isRequired,
  isNextVersionActivating: PropTypes.bool.isRequired,
  doPromptToSaveChanges: PropTypes.bool.isRequired,
  onSearch: PropTypes.func.isRequired,
  onLifecycleSelected: PropTypes.func.isRequired,
  onNextVersionSaved: PropTypes.func.isRequired,
  onNextVersionActivated: PropTypes.func.isRequired,
  onNextVersionSaveValidationFailed: PropTypes.func.isRequired,
  onNextVersionModified: PropTypes.func.isRequired,
  onLifecycleOfChanged: PropTypes.func.isRequired
};

export default List;
