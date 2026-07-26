import { useState, useEffect } from "react";
import "./Admincreateplan.css";
import Navbar from "../Admindash/Navbar";

const DURATION_OPTIONS = [30, 60, 90];

export default function AdminCreatePlan() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [plan, setPlan] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const token = (() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored).token : null;
  })();

  const fetchPlans = () => {
    fetch("http://localhost:5000/api/subscription-plans")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPlans(data.plans);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !plan.trim() || !price || !duration) {
      setError("Please fill in name, plan, price, and duration.");
      return;
    }

    setSaving(true);

    fetch("http://localhost:5000/api/admin/subscription-plans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name.trim(),
        plan: plan.trim(),
        price: Number(price),
        description: description.trim(),
        duration: Number(duration),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setName("");
          setPlan("");
          setPrice("");
          setDescription("");
          setDuration("");
          fetchPlans();
        } else {
          setError(data.message || "Could not create plan.");
        }
      })
      .catch(() => setError("Something went wrong. Please try again."))
      .finally(() => setSaving(false));
  };

  return (
    <>
      <Navbar />
      <div className="forge-createplan-page">
        <div className="forge-createplan-header">
          <h1>Subscription Plans</h1>
          <p>Create and manage the plans users can subscribe to.</p>
        </div>

      <form onSubmit={handleSubmit} className="forge-createplan-form">
        <div className="forge-field-row">
          <div className="forge-field">
            <label className="forge-label">Plan Name</label>
            <input
              className="forge-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 30-Day Transformation"
            />
          </div>
          <div className="forge-field">
            <label className="forge-label">Plan Type</label>
            <input
              className="forge-input"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              placeholder="e.g. premium"
            />
          </div>
        </div>

        <div className="forge-field-row">
          <div className="forge-field">
            <label className="forge-label">Price</label>
            <input
              type="number"
              className="forge-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 2999"
            />
          </div>
          <div className="forge-field">
            <label className="forge-label">Duration</label>
            <select
              className="forge-input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="">Select duration</option>
              {DURATION_OPTIONS.map((d) => (
                <option key={d} value={d}>{d} days</option>
              ))}
            </select>
          </div>
        </div>

        <div className="forge-field">
          <label className="forge-label">Description</label>
          <textarea
            className="forge-input forge-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What this plan includes"
            rows={2}
          />
        </div>

        {error && <p className="forge-error">{error}</p>}

        <button type="submit" className="btn-forge-primary" disabled={saving}>
          {saving ? "Creating..." : "Create Plan"}
        </button>
      </form>

      <h2 className="forge-createplan-subheader">Existing Plans</h2>

      {loading ? (
        <p className="forge-createplan-status">Loading...</p>
      ) : plans.length === 0 ? (
        <p className="forge-createplan-status">No plans created yet.</p>
      ) : (
        <div className="forge-createplan-list">
          {plans.map((p) => (
            <div key={p._id} className="forge-createplan-card">
              <div>
                <p className="forge-createplan-name">{p.name}</p>
                <p className="forge-createplan-meta">
                  {p.plan} · {p.duration} days · {p.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  );
}