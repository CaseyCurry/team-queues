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
      isLifecycleBeingAdded={this.props.isLifecycleBeingAdded}
      searchString={this.props.searchString}
      isNextVersionSaving={this.props.isNextVersionSaving}
      isNextVersionActivating={this.props.isNextVersionActivating}
      defaultVersionCreator={this.props.defaultVersionCreator}
      hasNextVersionBeenModified={this.props.hasNextVersionBeenModified}
      doPromptToSaveChanges={this.props.doPromptToSaveChanges}
      onSelected={this.props.onSelected}
      onLifecycleOfChanged={this.props.onLifecycleOfChanged}
      onNextVersionSaved={this.props.onNextVersionSaved}
      onNextVersionActivated={this.props.onNextVersionActivated}
      onNextVersionSaveValidationFailed={this.props.onNextVersionSaveValidationFailed}
      onNextVersionModified={this.props.onNextVersionModified} />;
  }
}

LifecyclesContainer.propTypes = {
  areLifecyclesLoading: PropTypes.bool.isRequired,
  lifecycles: PropTypes.array.isRequired,
  selectedLifecycle: PropTypes.object,
  isLifecycleBeingAdded: PropTypes.bool,
  searchString: PropTypes.string,
  isNextVersionSaving: PropTypes.bool.isRequired,
  isNextVersionActivating: PropTypes.bool.isRequired,
  defaultVersionCreator: PropTypes.func.isRequired,
  doPromptToSaveChanges: PropTypes.bool.isRequired,
  hasNextVersionBeenModified: PropTypes.bool.isRequired,
  onGetLifecycles: PropTypes.func.isRequired,
  onSelected: PropTypes.func.isRequired,
  onLifecycleOfChanged: PropTypes.func.isRequired,
  onNextVersionSaved: PropTypes.func.isRequired,
  onNextVersionActivated: PropTypes.func.isRequired,
  onNextVersionSaveValidationFailed: PropTypes.func.isRequired,
  onNextVersionModified: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return state.lifecycles;
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetLifecycles: () => {
      dispatch(actions.getLifecycles());
    },
    onSelected: (lifecycle) => {
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
    },
    onNextVersionModified: (hasNextVersionChanged) => {
      dispatch(actions.modifyNextVersion(hasNextVersionChanged));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LifecyclesContainer);
