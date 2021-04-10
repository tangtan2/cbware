import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import React from "react";
import PageWarehouseDashboard from "./Pages/PageWarehouseDashboard";
import PageUserDashboard from "./Pages/PageUserDashboard";
import PageAdminDashboard from "./Pages/PageAdminDashboard";
import PageUserLogin from "./Pages/PageUserLogin";
import PageCreateNewUser from "./Pages/PageCreateNewUser";
import { PageUnauthorized } from "./Pages/PageUnauthorized";
import { PageBadRequest } from "./Pages/PageBadRequest";
import { PageNotFound } from "./Pages/PageNotFound";

export default class App extends React.Component {
  render = () => {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/test">
            <div>Hi, can I take your order?</div>
          </Route>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route exact path="/login" component={PageUserLogin} />
          <Route exact path="/warehouse" component={PageWarehouseDashboard} />
          <Route exact path="/user" component={PageUserDashboard} />
          <Route exact path="/admin" component={PageAdminDashboard} />
          <Route exact path="/create-new-user" component={PageCreateNewUser} />
          <Route exact path="/401" component={PageUnauthorized} />
          <Route exact path="/400" component={PageBadRequest} />
          <Route component={PageNotFound} />
        </Switch>
      </BrowserRouter>
    );
  };
}
