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
          isLifecycleSaving={this.props.isLifecycleSaving}
          onLifecycleSelected={this.props.onLifecycleSelected}
          onLifecycleOfChanged={this.props.onLifecycleOfChanged}
          onLifecycleSaved={this.props.onLifecycleSaved} />
        {
          this.props.selectedLifecycle &&
          <Lifecycle
            className="d-none d-md-block col-md-8 col-lg-9"
            lifecycle={this.props.selectedLifecycle}
            onLifecycleSaved={this.props.onLifecycleSaved}
            isLifecycleSaving={this.props.isLifecycleSaving} />
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
  isLifecycleSaving: PropTypes.bool.isRequired,
  onLifecycleSelected: PropTypes.func.isRequired,
  onLifecycleOfChanged: PropTypes.func.isRequired,
  onLifecycleSaved: PropTypes.func.isRequired
};

export default Lifecycles;
