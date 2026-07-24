import { useState, useEffect, useCallback } from "react";
import WorkoutModal from "./Workoutmodal";
import { useNavigate } from "react-router-dom";

function WorkoutToday() {
   var navigate = useNavigate()
  var [modalOpen, setModalOpen] = useState(false);
  var [workouts, setWorkouts] = useState([]);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState("");

  var token = (() => {
    var stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored).token : null;
  })();

  var fetchTodaysWorkouts = useCallback(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/workouts/today", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWorkouts(data.workouts);
        } else {
          setError(data.message || "Could not load workouts.");
        }
      })
      .catch(() => setError("Could not load workouts."))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchTodaysWorkouts();
  }, [fetchTodaysWorkouts]);

  return (
    <div className="dashboard-card">
      <h3>Today's Workout</h3>

      {loading && <p className="dashboard-muted">Loading...</p>}
      {!loading && error && <p className="forge-error">{error}</p>}

      {!loading && !error && workouts.length === 0 && (
        <p className="dashboard-muted">No workouts logged for today yet.</p>
      )}

      {!loading && !error && workouts.length > 0 && (
        <ul className="dashboard-list">
          {workouts.map((w) => (
            <li key={w._id}>
              {w.workoutName} —{" "}
              {w.exercises.map((ex) => ex.exerciseName).join(", ")}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5  d-flex">
        <button className="btn-forge-primary mx-2" onClick={() => setModalOpen(true)}>
          Add New Workouts
        </button>
        <button className="btn-forge-primary  mx-2  " onClick={() => navigate("/workout-session")}>
  Start Workout
</button>
      </div>

      <WorkoutModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(workout) => {
          fetchTodaysWorkouts();
        }}
      />

    </div>
  );
}

export default WorkoutToday;