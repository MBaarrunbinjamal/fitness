import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./Login.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is invalid or missing its token.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    fetch("http://localhost:5000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccess(true);
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setError(data.message || "Could not reset password.");
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
          <h1 className="forge-login-title">Reset Password</h1>
          <p className="forge-login-sub">
            {success
              ? "Your password has been updated. Redirecting to login..."
              : "Choose a new password for your account."}
          </p>

          {!token && !success && (
            <p className="forge-error">
              This link is missing a reset token. Please request a new one from the{" "}
              <Link to="/forgot-password">forgot password</Link> page.
            </p>
          )}

          {token && !success && (
            <form onSubmit={handleSubmit} noValidate>
              <div className="forge-field">
                <label className="forge-label" htmlFor="newPassword">New Password</label>
                <div className="forge-input-group">
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    className="forge-input has-toggle"
                    placeholder="Enter a new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                <p className="forge-hint">Must be at least 6 characters.</p>
              </div>

              <div className="forge-field">
                <label className="forge-label" htmlFor="confirmNewPassword">Confirm Password</label>
                <div className="forge-input-group">
                  <input
                    id="confirmNewPassword"
                    type={showPassword ? "text" : "password"}
                    className="forge-input has-toggle"
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && <p className="forge-error">{error}</p>}

              <button type="submit" className="forge-submit" disabled={submitting}>
                {submitting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="forge-divider">or</div>

          <p className="forge-signup-text">
            <Link to="/login">Back to Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}