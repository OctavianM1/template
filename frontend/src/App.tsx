import React, { useContext } from "react";
import { Link, Route, Switch } from "react-router-dom";
import RegisterForm from "./pages/Register";
import Login from "./pages/Login";
import "./App.css";
import UserProvider, { UserContext } from "./auth/UserProvider";
import Activities from "./pages/Activities";
import Unauthorized from './pages/Unauthorized';

function App() {
  const userContext = useContext(UserContext);
  return (
    <div className="App">
      <nav>
        <Link to="register">Register</Link>
        <Link to="login">Login</Link>
        {userContext.user && (
          <Link to="activities">Activities</Link>
        )}
      </nav>   

      <Switch>  
        <Route path="/register">
          <RegisterForm />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/activities">
          <Activities />
        </Route>
        <Route path='/unauthorized'>
          <Unauthorized />
        </Route>
      </Switch>
    </div>
  );
}

function AppWrapper() {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
}

export default AppWrapper;
