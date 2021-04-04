import React, { useState } from 'react';

function RegisterForm() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [userPasswordError, setUserPasswordError] = useState("");

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (userPassword.length < 5) {
      setUserPasswordError("Password must be at least 5 characters");
      return;
    }
    setUserPasswordError("");
    console.log(userName, userEmail, userPassword);
    const response = await fetch("http://localhost:5000/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userName,
        email: userEmail,
        password: userPassword,
      }),
    });
    if (response.ok) {
      console.log("ok");
      
    } else {
      console.log(response);
    }
  };
  return (
    <div>
      <form onSubmit={onSubmit} className="form">
        <input
          type="text"
          value={userName}
          onChange={(ev: any) => setUserName(ev.target.value)}
          placeholder="User name"
        />
        <input
          type="email"
          value={userEmail}
          placeholder="User email"
          onChange={(ev: any) => setUserEmail(ev.target.value)}
        />
        <input
          type="password"
          value={userPassword}
          onChange={(ev: any) => {
            setUserPassword(ev.target.value);
            setUserPasswordError("");
          }}
          placeholder="User password"
        />
        {userPasswordError && (
          <span style={{ color: "red" }}>{userPasswordError}</span>
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterForm;