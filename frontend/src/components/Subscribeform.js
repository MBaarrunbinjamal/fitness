import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Subscriptionplans.css";

export default function SubscribeForm() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [address, setAddress] = useState("");
  const [cardnumber, setCardnumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const token = (() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored).token : null;
  })();

  useEffect(() => {
    fetch(`http://localhost:5000/api/subscription-plans/${planId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPlan(data.plan);
        } else {
          setError(data.message || "Plan not found.");
        }
      })
      .catch(() => setError("Could not load plan."))
      .finally(() => setLoading(false));
  }, [planId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!address.trim() || !cardnumber.trim()) {
      setError("Please fill in your address and card details.");
      return;
    }

    setSubmitting(true);

    fetch("http://localhost:5000/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ planId, address: address.trim(), cardnumber: cardnumber.trim() }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccess(true);
        } else {
          setError(data.message || "Could not submit subscription.");
        }
      })
      .catch(() => setError("Something went wrong. Please try again."))
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return (
      <div className="forge-plans-page">
        <p className="forge-plans-status">Loading plan...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="forge-plans-page">
        <div className="forge-subscribe-success">
          <h1>Request Submitted</h1>
          <p>
            Your subscription request is pending admin approval. Once approved, your
            personalized workout plan will be generated automatically based on your profile.
          </p>
          <button className="btn-forge-primary" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="forge-plans-page">
      <div className="forge-subscribe-card">
        {plan && (
          <div className="forge-subscribe-summary">
            <p className="forge-plan-name">{plan.name}</p>
            <h2 className="forge-plan-price">{plan.price}</h2>
            <p className="forge-plan-duration">{plan.duration} days</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="forge-field">
            <label className="forge-label">Address</label>
            <input
              className="forge-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Your address"
            />
          </div>

          <div className="forge-field">
            <label className="forge-label">Card Number</label>
            <input
              className="forge-input"
              value={cardnumber}
              onChange={(e) => setCardnumber(e.target.value)}
              placeholder="•••• •••• •••• ••••"
            />
          </div>

          {error && <p className="forge-error">{error}</p>}

          <button type="submit" className="btn-forge-primary forge-plan-btn" disabled={submitting}>
            {submitting ? "Submitting..." : "Confirm Subscription"}
          </button>
        </form>
      </div>
    </div>
  );
}