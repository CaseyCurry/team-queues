import React from "react";
import PropTypes from "prop-types";
import Loader from "../../../../controls/Loader";

class Lifecycle extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      lifecycle: this.props.lifecycle
    };
  }

  componentDidUpdate(previousProps) {
    if (this.props.lifecycle !== previousProps.lifecycle) {
      this.setState(this.getInitialState());
    }
  }

  cancel() {
    this.setState(this.getInitialState());
  }

  toggleActiveState() {
    const lifecycle = Object.assign({}, this.state.lifecycle, {
      isActive: !this.state.lifecycle.isActive
    });
    this.setState(Object.assign({}, this.state, {
      lifecycle
    }));
  }

  render() {
    return <div className={this.props.className + " workspace lifecycle"}>
      <div className="lifecycle-level-data">
        <label className="checkbox">active
          <input
            type="checkbox"
            checked={!!this.state.lifecycle.isActive}
            onChange={() => this.toggleActiveState()} />
          <span className="checkmark"></span>
        </label>
      </div>
      <div className="area">
        <div className="diagram">
          <pre>
            {
              JSON.stringify(this.state.lifecycle, null, 2)
            }
          </pre>
        </div>
      </div>
      <div className="actions">
        {
          this.props.isLifecycleSaving &&
          <button onClick={() => this.props.onLifecycleSaved(this.state.lifecycle)}>
            saving
            <Loader />
          </button>
        }
        {
          !this.props.isLifecycleSaving &&
          <button onClick={() => this.props.onLifecycleSaved(this.state.lifecycle)}>
            save
          </button>
        }
        <button onClick={() => this.cancel()}>cancel</button>
      </div>
    </div>;
  }
}

Lifecycle.propTypes = {
  lifecycle: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  isLifecycleSaving: PropTypes.bool.isRequired,
  onLifecycleSaved: PropTypes.func.isRequired
};

export default Lifecycle;
