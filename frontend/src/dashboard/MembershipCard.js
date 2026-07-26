import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MembershipCard() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = (() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored).token : null;
  })();

  useEffect(() => {
    fetch("http://localhost:5000/api/my-workout-plan", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPlan(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const formatExpiry = (date) =>
    new Date(date).toLocaleDateString(undefined, { month: "long", year: "numeric" });

  if (loading) {
    return (
      <div className="dashboard-card" id="membership">
        <h3>Membership</h3>
        <h2>...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-card" id="membership">
      <h3>Membership</h3>
      <h2>{plan ? "Premium" : "Free"}</h2>

      <p>
        {plan
          ? `Expires ${formatExpiry(plan.subscription?.expiresAt || plan.expiresAt)}`
          : "No active subscription"}
      </p>

      <button
        className="btn-forge-primary mt-3"
        onClick={() => navigate("/plans")}
      >
        {plan ? "Renew" : "Upgrade"}
      </button>
    </div>
  );
}

export default MembershipCard;      