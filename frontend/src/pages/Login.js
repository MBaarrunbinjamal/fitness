import { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";  
export default function LoginForm() {
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
  var navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const obj = { identifier, password };

    fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem(
            "auth",
            JSON.stringify({ token: data.token, user: data.user })
          );
          setSubmitted(true);
          if (data.user.role === "Admin") {
            navigate("/admin");
          }
          if(data.user.role === "user"){
            navigate("/dashboard");
          }
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

      <div className="forge-login-wrap">
        <div className="forge-login-card">
          <p className="forge-login-eyebrow">Welcome Back</p>
          <h1 className="forge-login-title">Sign In</h1>
          <p className="forge-login-sub">Log in to keep tracking your progress.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="forge-field">
              <label className="forge-label" htmlFor="loginIdentifier">Username or Email</label>
              <div className="forge-input-group">
                <input
                  id="loginIdentifier"
                  type="text"
                  className="forge-input"
                  placeholder="you@example.com or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            <div className="forge-field">
              <label className="forge-label" htmlFor="loginPassword">Password</label>
              <div className="forge-input-group">
                <input
                  id="loginPassword"
                  type={showPassword ? "text" : "password"}
                  className="forge-input has-toggle"
                  placeholder="Enter your password"
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
            </div>

            <div className="forge-login-row">
              <label className="forge-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
             <button type="button" className="forge-forgot" onClick={() => navigate("/forgot-password")}>
  Forgot password?
</button>
            </div>

            {error && <p className="forge-error">{error}</p>}
            {submitted && !error && (
              <p className="forge-success">Logged in successfully.</p>
            )}

            <button type="submit" className="forge-submit">Sign In</button>
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

          <p className="forge-signup-text">
            Don't have an account? <Link to="/register">Register Now</Link>
          </p>
          

        </div>

      </div>
    </>
  );
} 