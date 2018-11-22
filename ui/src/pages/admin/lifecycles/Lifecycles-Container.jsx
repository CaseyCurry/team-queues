import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import actions from "./actions";
import Lifecycles from "./components/Lifecycles";

class LifecyclesContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this
      .props
      .onGetLifecycles();
  }

  render() {
    return <Lifecycles
      areLifecyclesLoading={this.props.areLifecyclesLoading}
      lifecycles={this.props.lifecycles}
      selectedLifecycle={this.props.selectedLifecycle}
      isAddingLifecycle={this.props.isAddingLifecycle}
      searchString={this.props.searchString}
      isLifecycleSaving={this.props.isLifecycleSaving}
      onLifecycleSelected={this.props.onLifecycleSelected}
      onLifecycleOfChanged={this.props.onLifecycleOfChanged}
      onLifecycleSaved={this.props.onLifecycleSaved} />;
  }
}

LifecyclesContainer.propTypes = {
  areLifecyclesLoading: PropTypes.bool.isRequired,
  lifecycles: PropTypes.array.isRequired,
  selectedLifecycle: PropTypes.object,
  isAddingLifecycle: PropTypes.bool,
  searchString: PropTypes.string,
  isLifecycleSaving: PropTypes.bool.isRequired,
  onGetLifecycles: PropTypes.func.isRequired,
  onLifecycleSelected: PropTypes.func.isRequired,
  onLifecycleOfChanged: PropTypes.func.isRequired,
  onLifecycleSaved: PropTypes.func.isRequired
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
    onLifecycleSaved: (lifecycle) => {
      dispatch(actions.saveLifecycle(lifecycle));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LifecyclesContainer);
