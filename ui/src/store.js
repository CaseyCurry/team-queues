import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import reducers from "./reducers";

const middleware = applyMiddleware(promise(), thunk);

const store = createStore(
  reducers,
  compose(middleware)
);


export default store;