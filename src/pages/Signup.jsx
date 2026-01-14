import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <h2>Create Account</h2>

      <button
        className="login-btn"
        onClick={() => navigate("/signup-email")}
      >
        Sign up with Email
      </button>

      <p className="link" onClick={() => navigate("/")}>
        Back to Login
      </p>
    </div>
  );
}
