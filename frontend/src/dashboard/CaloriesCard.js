import { useState, useEffect, useCallback } from "react";
import NutritionModal from "./Nutritionmodal";

var DAILY_CALORIE_GOAL = 2500; // adjust to match your target/profile-driven goal later

function CaloriesCard() {
  var [modalOpen, setModalOpen] = useState(false);
  var [calories, setCalories] = useState(0);
  var [loading, setLoading] = useState(true);

  var token = (() => {
    var stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored).token : null;
  })();

  var fetchTodayNutrition = useCallback(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/nutrition/today", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCalories(data.totals.calories);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchTodayNutrition();
  }, [fetchTodayNutrition]);

  var percentFilled = Math.min(100, (calories / DAILY_CALORIE_GOAL) * 100);

  return (
    <div className="dashboard-card">
      <h3>Calories</h3>

      <h2>{loading ? "..." : `${Math.round(calories)} kcal`}</h2>

      <p>Consumed Today</p>

      <div className="mini-bar">
        <div className="mini-fill" style={{ width: `${percentFilled}%` }}></div>
      </div>

      <div className="mt-3">
        <button className="btn-forge-primary" onClick={() => setModalOpen(true)}>
          Add Todays Nutrients
        </button>
      </div>

      <NutritionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => {
          fetchTodayNutrition();
        }}
      />
    </div>
  );
}

export default CaloriesCard;