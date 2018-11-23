import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import actions from "./actions";
import notifications from "../../../components/notifications/actions";
import Lifecycles from "./components/Lifecycles";

class LifecyclesContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.onGetLifecycles();
  }

  render() {
    return <Lifecycles
      areLifecyclesLoading={this.props.areLifecyclesLoading}
      lifecycles={this.props.lifecycles}
      selectedLifecycle={this.props.selectedLifecycle}
      isAddingLifecycle={this.props.isAddingLifecycle}
      searchString={this.props.searchString}
      isNextVersionSaving={this.props.isNextVersionSaving}
      isNextVersionActivating={this.props.isNextVersionActivating}
      defaultVersionCreator={this.props.defaultVersionCreator}
      onLifecycleSelected={this.props.onLifecycleSelected}
      onLifecycleOfChanged={this.props.onLifecycleOfChanged}
      onNextVersionSaved={this.props.onNextVersionSaved}
      onNextVersionActivated={this.props.onNextVersionActivated}
      onNextVersionSaveValidationFailed={this.props.onNextVersionSaveValidationFailed} />;
  }
}

LifecyclesContainer.propTypes = {
  areLifecyclesLoading: PropTypes.bool.isRequired,
  lifecycles: PropTypes.array.isRequired,
  selectedLifecycle: PropTypes.object,
  isAddingLifecycle: PropTypes.bool,
  searchString: PropTypes.string,
  isNextVersionSaving: PropTypes.bool.isRequired,
  isNextVersionActivating: PropTypes.bool.isRequired,
  defaultVersionCreator: PropTypes.func.isRequired,
  onGetLifecycles: PropTypes.func.isRequired,
  onLifecycleSelected: PropTypes.func.isRequired,
  onLifecycleOfChanged: PropTypes.func.isRequired,
  onNextVersionSaved: PropTypes.func.isRequired,
  onNextVersionActivated: PropTypes.func.isRequired,
  onNextVersionSaveValidationFailed: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return state.lifecycles;
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetLifecycles: () => {
      dispatch(actions.getLifecycles());
    },
    onLifecycleSelected: (lifecycle) => {
      dispatch(actions.selectLifecycle(lifecycle));
    },
    onLifecycleOfChanged: (lifecycleOf) => {
      dispatch(actions.changeLifecycleOf(lifecycleOf));
    },
    onNextVersionSaved: (nextVersion) => {
      dispatch(actions.saveNextVersion(nextVersion));
    },
    onNextVersionActivated: (nextVersion) => {
      dispatch(actions.activateNextVersion(nextVersion));
    },
    onNextVersionSaveValidationFailed: (message) => {
      dispatch(notifications.addError({ message }));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LifecyclesContainer);
