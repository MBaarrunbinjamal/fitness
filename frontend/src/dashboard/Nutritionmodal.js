import { useState } from "react";
import "./Nutritionmodal.css";

var MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

export default function NutritionModal({ open, onClose, onCreated }) {
  var [foodName, setFoodName] = useState("");
  var [mealType, setMealType] = useState("");
  var [grams, setGrams] = useState("");
  var [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  var [error, setError] = useState("");
  var [saving, setSaving] = useState(false);

  if (!open) return null;

  var token = (() => {
    var stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored).token : null;
  })();

  var resetForm = () => {
    setFoodName("");
    setMealType("");
    setGrams("");
    setDate(new Date().toISOString().slice(0, 10));
    setError("");
  };

  var handleClose = () => {
    resetForm();
    onClose();
  };

  var handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!foodName.trim() || !mealType || !grams || isNaN(grams) || Number(grams) <= 0) {
      setError("Please enter a valid food name, meal type, and grams.");
      return;
    }

    setSaving(true);

    fetch("http://localhost:5000/api/nutrition", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        foodName: foodName.trim(),
        mealType,
        grams: Number(grams),
        date,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (onCreated) onCreated(data.data);
          handleClose();
        } else {
          setError(data.message || "Could not add this food.");
        }
      })
      .catch(() => setError("Something went wrong. Please try again."))
      .finally(() => setSaving(false));
  };

  return (
    <div className="forge-modal-overlay" onClick={handleClose}>
      <div className="forge-modal forge-modal-narrow" onClick={(e) => e.stopPropagation()}>
        <div className="forge-modal-header">
          <h2>Add Today's Nutrients</h2>
          <button className="forge-modal-close" onClick={handleClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="forge-modal-body">
          <div className="forge-field">
            <label className="forge-label">Food Name</label>
            <input
              className="forge-input"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g. Grilled chicken breast"
            />
            <p className="forge-hint-small">We'll pull calories and macros from the USDA food database.</p>
          </div>

          <div className="forge-field-row">
            <div className="forge-field">
              <label className="forge-label">Meal Type</label>
              <select
                className="forge-input"
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
              >
                <option value="">Select meal</option>
                {MEAL_TYPES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="forge-field">
              <label className="forge-label">Quantity (grams)</label>
              <input
                type="number"
                className="forge-input"
                value={grams}
                onChange={(e) => setGrams(e.target.value)}
                placeholder="e.g. 150"
                min="1"
              />
            </div>
          </div>

          <div className="forge-field">
            <label className="forge-label">Date</label>
            <input
              type="date"
              className="forge-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {error && <p className="forge-error">{error}</p>}

          <div className="forge-modal-actions">
            <button type="button" className="forge-modal-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-forge-primary" disabled={saving}>
              {saving ? "Adding..." : "Add Nutrient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}