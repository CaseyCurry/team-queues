import React from "react";
import {Provider} from "react-redux";
import {BrowserRouter, Route} from "react-router-dom";
import Queues from "./pages/queues/Queues";
import ConfiguredEventsContainer from "./pages/admin/configured-events/Configured-Events-Container";
import store from "./store";
// import BudgetContainer from "./pages/budget/BudgetContainer"; import
// TransactionsContainer from "./pages/transactions/TransactionsContainer";
// import TrendsContainer from "./pages/trends/TrendsContainer"; import
// ProgressContainer from "./pages/progress/ProgressContainer"; import
// AuthenticationContainer from
// "./pages/authentication/AuthenticationContainer"; import { findToken } from
// "./modules/authentication";
import "./styles/main";

const App = () => {
  return <Provider store={store}>
    <BrowserRouter>
      <div className="fluid-container">
        <Route path="/queues" component={Queues}/>
        <Route path="/configured-events" component={ConfiguredEventsContainer}/>
      </div>
    </BrowserRouter>
  </Provider>;
};

export default App;

// const getBudgetContainer = (nextState, callback) => {   return
// getSecuredComponent(BudgetContainer, callback); };
//
// const getTransactionsContainer = (nextState, callback) => {   return
// getSecuredComponent(TransactionsContainer, callback); };
//
// const getTrendsContainer = (nextState, callback) => {   return
// getSecuredComponent(TrendsContainer, callback); };
//
// const getProgressContainer = (nextState, callback) => {   return
// getSecuredComponent(ProgressContainer, callback); };
//
// const getSecuredComponent = (component, callback) => {   const token =
// findToken();   if (token) {     callback(null, component);   } else {
// callback(null, authenticationComponent(component));   } };
//
// const authenticationComponent = (next) => {   const Wrapper = () => { return
// <AuthenticationContainer next={next}/>;   };   return Wrapper; };