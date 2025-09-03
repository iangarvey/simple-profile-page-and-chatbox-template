import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("token" ? true : false));
  const token = localStorage.getItem("token");
  const apiUrl = `${import.meta.env.VITE_BACKEND_URL}`;
  const navigate = useNavigate();

  useEffect(() => {
          const token = localStorage.getItem("token");
          if (token) {
              navigate("/myprofile");
              console.log("Token found, navigating to /myprofile");
              return;
          }
  }, [navigate]);


  const handleLogin = async (e) => {
    e.preventDefault();

    const opts = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "email": email,
        "password": password
      })
    }
    // fetch(`${apiUrl}api/login`, opts)
    //   .then(resp => {
    //     if (resp.status === 200) return resp.json();
    //     else alert("There has been some error")
    //   })
    //   .then(data => {
    //     localStorage.setItem("token", data.access_token);
    //     setLoggedIn(true);

    //     // Notify navbar and other components of auth change
    //     window.dispatchEvent(new Event('authChange'));
        
    //   })
    //   .catch(error => {
    //     console.error("There was an error!!!", error);
    //   })
    
    const response = await fetch(
      `${apiUrl}api/login`,
      opts
    );

    const data = await response.json();
    console.log("here's your data", data)

    if (!response.ok) {
      alert(data.error || "Login failed");
      return;
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      setLoggedIn(true);
      
      // Notify navbar and other components of auth change
      window.dispatchEvent(new Event('authChange'));
  }}

  return (
    <div>
      <h1 className="page-title d-flex justify-content-center">Login</h1>
      <div>
        {(token && token != "" && token != undefined) ? (
          "You are logged in with this token " + token
        ) : (
          <form
            className="container border border-info p-2 "
            style={{ width: "500px" }}
          >
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              ></input>
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              ></input>
            </div>

            <button type="submit" className="btn btn-primary" onClick={handleLogin}>
              Login
            </button>

          </form>
        )}
      </div>
    </div>
  );
};
