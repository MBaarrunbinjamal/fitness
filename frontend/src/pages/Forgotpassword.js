import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setSubmitting(true);

    fetch("http://localhost:5000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSent(true);
        } else {
          setError(data.message || "Could not send reset link.");
        }
      })
      .catch(() => setError("Something went wrong. Please try again."))
      .finally(() => setSubmitting(false));
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
          <p className="forge-login-eyebrow">Account Recovery</p>
          <h1 className="forge-login-title">Forgot Password</h1>
          <p className="forge-login-sub">
            {sent
              ? "Check your inbox for a link to reset your password."
              : "Enter the email on your account and we'll send you a reset link."}
          </p>

          {!sent ? (
            <form onSubmit={handleSubmit} noValidate>
              <div className="forge-field">
                <label className="forge-label" htmlFor="forgotEmail">Email</label>
                <div className="forge-input-group">
                  <input
                    id="forgotEmail"
                    type="text"
                    className="forge-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {error && <p className="forge-error">{error}</p>}

              <button type="submit" className="forge-submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <p className="forge-success">Reset link sent. It will expire in 1 hour.</p>
          )}

          <div className="forge-divider">or</div>

          <p className="forge-signup-text">
            Remembered your password? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </>
  );
}