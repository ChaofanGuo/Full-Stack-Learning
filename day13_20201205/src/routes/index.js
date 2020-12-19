import React from "react";
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import HomePage from "../pages/HomePage";
import UserPage from "../pages/UserPage";
import _404Page from "../pages/_404Page";
import LoginPage from "../pages/LoginPage";
import PrivateRoute from "./PrivateRoute";
import BottomNav from "../components/BottomNav"

export const routes = [
  {
    path: "/",
    exact: true,
    component: HomePage
  },
  {
    path: "/user",
    component: UserPage,
    auth: PrivateRoute
  },
  {
    path: "/login",
    component: LoginPage
  },
  {
    component: _404Page
  }
];

export default function Routes(props) {
  return (
    <Router>
      <BottomNav/>
      <Switch>
        {
          // routes.map(route => <Route key={route.path + '_route'} component={route.component}/>)
          // 椰子
          routes.map(route => route.auth
            ? <PrivateRoute key={route.path + '_route'} {...route} />
            : <Route key={route.path + '_route'} {...route} />
          )
        }
      </Switch>
    </Router>
  );
}
