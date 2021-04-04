import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { AppUser, UserContext } from "../auth/UserProvider";

function Login() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [userEmailError, setUserEmailError] = useState("");
  const [userPasswordError, setUserPasswordError] = useState("");

  const userContext = useContext(UserContext);

  const history = useHistory();

  const resetErrors = () => {
    setUserPasswordError("");
    setUserEmailError("");
  };

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const response = await fetch("http://localhost:5000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        password: userPassword,
      }),
    });
    if (response.ok) {
      const user: AppUser = await response.json();
      userContext.setUser(user);
      history.push("/activities");
    } else {
      if (response.status === 400) {
        const serverResponse = await response.json();
        serverResponse.email && setUserEmailError(serverResponse.email);
        console.log(serverResponse);
        serverResponse.password &&
          setUserPasswordError(serverResponse.password);
      }
    }
  };
  return (
    <div>
      <form onSubmit={onSubmit} className="form">
        <input
          type="email"
          value={userEmail}
          placeholder="User email"
          onChange={(ev: any) => {
            setUserEmail(ev.target.value);
            resetErrors();
          }}
        />
        {userEmailError && (
          <span style={{ color: "red" }}>{userEmailError}</span>
        )}
        <input
          type="password"
          value={userPassword}
          onChange={(ev: any) => {
            setUserPassword(ev.target.value);
            resetErrors();
          }}
          placeholder="User password"
        />
        {userPasswordError && (
          <span style={{ color: "red" }}>{userPasswordError}</span>
        )}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
