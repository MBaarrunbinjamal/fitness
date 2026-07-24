import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import { GoogleLogin } from "@react-oauth/google";
export default function RegisterForm() {
  const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        credential: credentialResponse.credential,
      }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem(
        "auth",
        JSON.stringify({
          token: data.token,
          user: data.user,
        })
      );

      if (data.user.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError(data.message);
    }
  } catch (err) {
    console.log(err);
    setError("Google login failed.");
  }
};
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const obj = { username, email, password, confirmPassword };

    fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        } else {
          setError(data.message);
        }
      })
      .catch(err => {
        console.log('something went wrong', err);
        setError('Something went wrong. Please try again.');
      });
  };

  return (
    <>
      <Link to="/" className="forge-back-home">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12l9-9 9 9" />
          <path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
        </svg>
        Back to Home
      </Link>

      <div className="forge-register-wrap">
        <div className="forge-register-card">
          <p className="forge-register-eyebrow">Join Forge</p>
          <h1 className="forge-register-title">Create Account</h1>
          <p className="forge-register-sub">Start your transformation today.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="forge-field">
              <label className="forge-label" htmlFor="regName">Full Name</label>
              <div className="forge-input-group">
                <input
                  id="regName"
                  type="text"
                  className="forge-input"
                  placeholder="John Doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="forge-field">
              <label className="forge-label" htmlFor="regEmail">Email</label>
              <div className="forge-input-group">
                <input
                  id="regEmail"
                  type="email"
                  className="forge-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="forge-field">
              <label className="forge-label" htmlFor="regPassword">Password</label>
              <div className="forge-input-group">
                <input
                  id="regPassword"
                  type={showPassword ? "text" : "password"}
                  className="forge-input has-toggle"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="forge-toggle-visibility"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className="forge-hint">Must be at least 8 characters.</p>
            </div>

            <div className="forge-field">
              <label className="forge-label" htmlFor="regConfirmPassword">Confirm Password</label>
              <div className="forge-input-group">
                <input
                  id="regConfirmPassword"
                  type={showConfirm ? "text" : "password"}
                  className="forge-input has-toggle"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="forge-toggle-visibility"
                  onClick={() => setShowConfirm((s) => !s)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="forge-terms-row">
              <label className="forge-terms">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>
                  I agree to the <a href="#">Terms &amp; Conditions</a> and{" "}
                  <a href="#">Privacy Policy</a>.
                </span>
              </label>
            </div>

            {error && <p className="forge-error">{error}</p>}

            <button type="submit" className="forge-submit">Create Account</button>
          </form>

<div className="forge-divider">or</div>

<div style={{ marginBottom: "20px" }}>
  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={() => {
      setError("Google login failed.");
    }}
    theme="filled_black"
    shape="pill"
    width="100%"
    text="continue_with"
  />
</div>
          <p className="forge-signin-text">
            Already have an account? <Link to="/login">Login In</Link>
          </p>
        </div>
      </div>
    </>
  );
}