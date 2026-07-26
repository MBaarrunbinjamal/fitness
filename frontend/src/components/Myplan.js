import { useState, useEffect } from "react";
import "./Myplan.css";
import DashboardNavbar from "../dashboard/DashboardNavbar";

export default function MyPlan() {
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDayIndex, setActiveDayIndex] = useState(null);

  const token = (() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored).token : null;
  })();

  const fetchPlan = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/my-workout-plan", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPlanData(data);
          setActiveDayIndex(data.dayNumber - 1);
        } else {
          setError(data.message || "No active plan found.");
        }
      })
      .catch(() => setError("Could not load your plan."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const toggleExercise = (dayIndex, exerciseIndex, completed) => {
    fetch(`http://localhost:5000/api/my-workout-plan/${dayIndex}/exercises/${exerciseIndex}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPlanData((prev) => {
            const updated = { ...prev };
            const fullPlan = [...updated.fullPlan];
            const day = { ...fullPlan[dayIndex] };
            const exercises = [...day.exercises];
            exercises[exerciseIndex] = { ...exercises[exerciseIndex], completed };
            day.exercises = exercises;
            fullPlan[dayIndex] = day;
            updated.fullPlan = fullPlan;
            if (dayIndex === updated.dayNumber - 1) {
              updated.today = day;
            }
            return updated;
          });
        }
      })
      .catch(() => {});
  };

  if (loading) {
    return (
      <div className="forge-myplan-page">
        <p className="forge-myplan-status">Loading your plan...</p>
      </div>
    );
  }

  if (error || !planData) {
    return (
      <div className="forge-myplan-page">
        <p className="forge-myplan-status">{error || "No active plan."}</p>
      </div>
    );
  }

  const activeDay = planData.fullPlan[activeDayIndex];

  return (
  <>
  <DashboardNavbar/>
    <div className="forge-myplan-page">
      <div className="forge-myplan-header">
        <h1>Your Plan</h1>
        <p>Day {planData.dayNumber} of {planData.fullPlan.length}</p>
      </div>

      <div className="forge-myplan-tabs">
        {planData.fullPlan.map((day, idx) => (
          <button
            key={idx}
            className={`forge-myplan-tab ${idx === activeDayIndex ? "active" : ""} ${idx === planData.dayNumber - 1 ? "is-today" : ""}`}
            onClick={() => setActiveDayIndex(idx)}
          >
            Day {day.day}
          </button>
        ))}
      </div>

      {activeDay && (
        <div className="forge-myplan-card">
          <h2 className="forge-myplan-day-title">{activeDay.title}</h2>

          {activeDay.exercises.length === 0 ? (
            <p className="forge-myplan-rest">Rest day — recover and stay hydrated.</p>
          ) : (
            <ul className="forge-myplan-exercise-list">
              {activeDay.exercises.map((ex, exIdx) => (
                <li key={exIdx} className={`forge-myplan-exercise ${ex.completed ? "done" : ""}`}>
                  <label>
                    <input
                      type="checkbox"
                      checked={!!ex.completed}
                      onChange={(e) => toggleExercise(activeDayIndex, exIdx, e.target.checked)}
                    />
                    <div>
                      <span className="forge-myplan-exercise-name">{ex.exerciseName}</span>
                      <span className="forge-myplan-exercise-detail">
                        {ex.sets} sets × {ex.reps} reps
                        {ex.notes ? ` — ${ex.notes}` : ""}
                      </span>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  </>
  );
}