import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers
} from "redux";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import notificationReducers from "./components/notifications/reducers";
import configuredEventReducers from "./pages/admin/configured-events/reducers";
import lifecycleReducers from "./pages/admin/lifecycles/reducers";

const reducers = combineReducers({
  notifications: notificationReducers,
  configuredEvents: configuredEventReducers,
  lifecycles: lifecycleReducers
});

const middleware = applyMiddleware(promise(), thunk);

const store = createStore(
  reducers,
  compose(middleware)
);

export default store;
