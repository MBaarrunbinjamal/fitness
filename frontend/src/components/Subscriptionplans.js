import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Subscriptionplans.css";

const REQUIRED_FIELDS = ["height", "weight", "dateOfBirth", "gender", "fitnessGoal", "activityLevel", "experienceLevel"];

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = (() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored).token : null;
  })();

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/subscription-plans").then((r) => r.json()),
      fetch("http://localhost:5000/api/getuser", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    ])
      .then(([plansData, userData]) => {
        if (plansData.success) setPlans(plansData.plans);
        if (userData.success) setUser(userData.user);
        if (!plansData.success) setError(plansData.message || "Could not load plans.");
      })
      .catch(() => setError("Could not load plans."))
      .finally(() => setLoading(false));
  }, [token]);

  const missingFields = user ? REQUIRED_FIELDS.filter((f) => !user[f]) : [];
  const profileComplete = missingFields.length === 0;

  const handleChoosePlan = (planId) => {
    if (!profileComplete) return;
    navigate(`/subscribe/${planId}`);
  };

  if (loading) {
    return (
      <div className="forge-plans-page">
        <p className="forge-plans-status">Loading plans...</p>
      </div>
    );
  }

  return (
    <div className="forge-plans-page">
      <div className="forge-plans-header">
        <h1>Choose Your Plan</h1>
        <p>Get a workout plan built around your goals, generated the moment you're approved.</p>
      </div>

      {!profileComplete && (
        <div className="forge-profile-warning">
          <p>
            Complete your profile before subscribing. Missing: {missingFields.join(", ")}
          </p>
          <button className="btn-forge-primary" onClick={() => navigate("/profile")}>
            Complete Profile
          </button>
        </div>
      )}

      {error && <p className="forge-error">{error}</p>}

      <div className="forge-plans-grid">
        {plans.map((plan) => (
          <div key={plan._id} className="forge-plan-card">
            <p className="forge-plan-name">{plan.name}</p>
            <h2 className="forge-plan-price">{plan.price}</h2>
            <p className="forge-plan-duration">{plan.duration} days</p>
            <p className="forge-plan-description">{plan.description}</p>
            <button
              className="btn-forge-primary forge-plan-btn"
              onClick={() => handleChoosePlan(plan._id)}
              disabled={!profileComplete}
            >
              {profileComplete ? "Choose Plan" : "Complete Profile First"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}