import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // added error state
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Sign up failed");
      return;
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    navigate("/profile");
  };

  return (
    <div>
      <h1 className="title d-flex justify-content-center">Register</h1>
      <form
        className="container border border-info p-2"
        style={{ width: "500px" }}
        onSubmit={handleRegister}
      >
        {/* Username */}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        {/* Show error if signup fails */}
        {error && <p className="text-danger">{error}</p>}

        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
};
