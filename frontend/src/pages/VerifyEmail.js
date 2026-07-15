import { useState, useEffect } from "react";
import "./VerifyEmail.css";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
// Possible states: "verifying" | "success" | "error" | "expired"
export default function VerifyEmail() {
  const [status, setStatus] = useState("pending");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [searchParams] = useSearchParams();
  

  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const navigate = useNavigate();

useEffect(() => {
  // ===============================
  // User has just registered
  // ===============================
  if (!token && email) {
    setStatus("pending");
    setMessage(
      "We've sent a verification email to your inbox. Please check your email and click the verification link to activate your account."
    );
    return;
  }

  // ===============================
  // Invalid URL
  // ===============================
  if (!token && !email) {
    setStatus("error");
    setMessage("Invalid verification request.");
    return;
  }

  // ===============================
  // User clicked verification link
  // ===============================
  setStatus("verifying");

  fetch(
    `http://localhost:5000/api/auth/verify-email?token=${encodeURIComponent(
      token
    )}`
  )
    .then((res) => res.json())
  .then((data) => {
  if (data.success) {

    // Store JWT
    if (data.token&&data.user) {
  localStorage.setItem(
  "auth",
  JSON.stringify({
    token: data.token,
    user: data.user,
  })
);
    }

  
  
    setStatus("success");
    setMessage(data.message || "Email verified successfully.");

    // Automatically redirect after 2 seconds
    setTimeout(() => {
      navigate("/");
      // or navigate("/dashboard");
    }, 2000);

  } else {
    setStatus("expired");
    setMessage(
      data.message || "This verification link has expired or is invalid."
    );
  }
})
    .catch(() => {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    });
}, [token, email]);

  const handleResend = () => {
    if (!email) return;
    setResending(true);
    fetch("http://localhost:5000/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then(() => {
        setResending(false);
        setResent(true);
      })
      .catch(() => {
        setResending(false);
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
        <div className="forge-register-card forge-verify-card">
          <p className="forge-register-eyebrow">Join Forge</p>
{status === "pending" && (
  <>
    <div className="forge-verify-icon forge-verify-success">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 2L11 13" />
        <path d="M22 2L15 22L11 13L2 9L22 2Z" />
      </svg>
    </div>

    <h1 className="forge-register-title">
      Check your email
    </h1>

    <p className="forge-register-sub">
      {message}
    </p>

    <button
      type="button"
      className="forge-submit forge-verify-cta"
      onClick={handleResend}
      disabled={resending || resent}
    >
      {resent
        ? "Verification email sent"
        : resending
        ? "Sending..."
        : "Resend verification email"}
    </button>
  </>
)}
          {status === "verifying" && (
            <>
              <div className="forge-verify-icon forge-verify-spin">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                </svg>
              </div>
              <h1 className="forge-register-title">Verifying your email</h1>
              <p className="forge-register-sub">Hang tight, this only takes a second.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="forge-verify-icon forge-verify-success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h1 className="forge-register-title">Email verified</h1>
              <p className="forge-register-sub">{message}</p>
             <Link to="/" className="forge-submit forge-verify-cta">
    Continue
</Link>
            </>
          )}

          {(status === "error" || status === "expired") && (
            <>
              <div className="forge-verify-icon forge-verify-fail">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </div>
              <h1 className="forge-register-title">
                {status === "expired" ? "Link expired" : "Verification failed"}
              </h1>
              <p className="forge-register-sub">{message}</p>

              {email && (
                <button
                  type="button"
                  className="forge-submit forge-verify-cta"
                  onClick={handleResend}
                  disabled={resending || resent}
                >
                  {resent ? "Verification email sent" : resending ? "Sending..." : "Resend verification email"}
                </button>
              )}
            </>
          )}

          <div className="forge-divider">or</div>

          <p className="forge-signin-text">
            Already verified? <Link to="/login">Login In</Link>
          </p>
        </div>
      </div>
    </>
  );
}
