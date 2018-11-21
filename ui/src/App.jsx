import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import Queues from "./pages/queues/Queues";
import ConfiguredEventsContainer from "./pages/admin/configured-events/Configured-Events-Container";
import store from "./store";
import "./styles/main";

const App = () => {
  return <Provider store={store}>
    <BrowserRouter>
      <div className="fluid-container">
        <Route path="/queues" component={Queues} />
        <Route path="/configured-events" component={ConfiguredEventsContainer} />
      </div>
    </BrowserRouter>
  </Provider>;
};

export default App;
