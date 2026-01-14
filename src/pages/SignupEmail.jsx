import { useState } from "react";
import { register } from "../auth";
import { useNavigate } from "react-router-dom";

export default function SignupEmail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSignup() {
    try {
      await register(email, password);
      alert("Account created. Please login.");
      navigate("/");
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="login-container">
      <label>Email</label>
      <input onChange={(e) => setEmail(e.target.value)} />

      <label>Password</label>
      <input type="password" onChange={(e) => setPassword(e.target.value)} />

      <button className="login-btn" onClick={handleSignup}>
        Create Account
      </button>
    </div>
  );
}
