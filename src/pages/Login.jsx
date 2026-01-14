import { useState } from "react";
import "../styles/login.css";

import { login } from "../auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-logo">CF</div>

      <label>Email</label>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Password</label>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
<div className="login-divider">
  <span>or</span>
</div>

<p className="link">Forgot Password?</p>

      <button className="login-btn" onClick={handleLogin} disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <p className="link" onClick={() => navigate("/signup")}>
        Create an account
      </p>
    </div>
  );
}
