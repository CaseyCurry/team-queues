import React from "react";
import PropTypes from "prop-types";
import Loader from "../../../../controls/Loader";
import List from "./List";
import Lifecycle from "./Lifecycle";

class Lifecycles extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.areLifecyclesLoading) {
      return <div className="page">
        <Loader />
      </div>;
    } else {
      return <div className="row page lifecycles">
        <List
          className="col-sm-12 col-md-4 col-lg-3"
          lifecycles={this.props.lifecycles}
          isAddingLifecycle={this.props.isAddingLifecycle}
          searchString={this.props.searchString}
          isNextVersionSaving={this.props.isNextVersionSaving}
          isNextVersionActivating={this.props.isNextVersionActivating}
          defaultVersionCreator={this.props.defaultVersionCreator}
          onLifecycleSelected={this.props.onLifecycleSelected}
          onLifecycleOfChanged={this.props.onLifecycleOfChanged}
          onNextVersionSaved={this.props.onNextVersionSaved}
          onNextVersionActivated={this.props.onNextVersionActivated}
          onNextVersionSaveValidationFailed={this.props.onNextVersionSaveValidationFailed} />
        {
          this.props.selectedLifecycle &&
          <Lifecycle
            className="d-none d-md-block col-md-8 col-lg-9"
            lifecycle={this.props.selectedLifecycle}
            isNextVersionSaving={this.props.isNextVersionSaving}
            isNextVersionActivating={this.props.isNextVersionActivating}
            onNextVersionSaved={this.props.onNextVersionSaved}
            onNextVersionActivated={this.props.onNextVersionActivated}
            onNextVersionSaveValidationFailed={this.props.onNextVersionSaveValidationFailed} />
        }
      </div>;
    }
  }
}

Lifecycles.propTypes = {
  areLifecyclesLoading: PropTypes.bool.isRequired,
  lifecycles: PropTypes.array.isRequired,
  selectedLifecycle: PropTypes.object,
  isAddingLifecycle: PropTypes.bool,
  searchString: PropTypes.string,
  isNextVersionSaving: PropTypes.bool.isRequired,
  isNextVersionActivating: PropTypes.bool.isRequired,
  defaultVersionCreator: PropTypes.func.isRequired,
  onLifecycleSelected: PropTypes.func.isRequired,
  onLifecycleOfChanged: PropTypes.func.isRequired,
  onNextVersionSaved: PropTypes.func.isRequired,
  onNextVersionActivated: PropTypes.func.isRequired,
  onNextVersionSaveValidationFailed: PropTypes.func.isRequired
};

export default Lifecycles;
