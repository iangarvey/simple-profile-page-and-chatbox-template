import { useState } from "react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const token = localStorage.getItem("token");
  console.log("This is your token ", token)

  const handleClick = () => {

    const opts = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    }
    fetch(`https://fantastic-telegram-7v5q56jrvrr5cxw45-3001.app.github.dev/api/token`, opts)
      .then(resp => {
        if(resp.status === 200) return resp.json();
        else alert("There has been some error")
      })
      .then(data => {
        localStorage.setItem("token", data.access_token)
      })
      .catch(error => {
        console.error("There was an error!!!", error);
      })

  }

  return (
    <div>
      <h1 className="page-title d-flex justify-content-center">Login</h1>
      <div>
        {(token && token!="" && token!=undefined) ? (
        "You are logged in with this token" + token 
        ) : (  
      <form
        className="container border border-info p-2 "
        style={{ width: "500px" }}
      >
        <div className="mb-3">
          <label for="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            onChange={(e) => setEmail(e.target.value)}
            value = {email}
          ></input>
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label for="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            onChange={(e) => setPassword(e.target.value)}
            value = {password}
          ></input>
        </div>
        <button type="submit" className="btn btn-primary" onClick={handleClick}>
          Login
        </button>
      </form>
      )}
      </div>
    </div>
  );
};
