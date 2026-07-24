import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Workoutsession.css";

export default function WorkoutSession() {
  var [workouts, setWorkouts] = useState([]);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState("");
  var [workoutIndex, setWorkoutIndex] = useState(0);
  var [exerciseIndex, setExerciseIndex] = useState(0);
  var navigate = useNavigate();

  var token = (() => {
    var stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored).token : null;
  })();

  useEffect(() => {
    fetch("http://localhost:5000/api/workouts/today", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWorkouts(data.workouts);
        } else {
          setError(data.message || "Could not load today's workout.");
        }
      })
      .catch(() => setError("Could not load today's workout."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="forge-session-page">
        <p className="forge-session-status">Loading today's workout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="forge-session-page">
        <p className="forge-session-status forge-error">{error}</p>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="forge-session-page">
        <p className="forge-session-status">No workout logged for today yet.</p>
        <button className="btn-forge-primary" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  var currentWorkout = workouts[workoutIndex];
  var currentExercise = currentWorkout.exercises[exerciseIndex];
  var totalExercises = currentWorkout.exercises.length;
  var doneCount = currentWorkout.exercises.filter((ex) => ex.completed).length;
  var isLastExercise = exerciseIndex === totalExercises - 1;
  var allWorkoutsDone =
    workoutIndex === workouts.length - 1 &&
    isLastExercise &&
    currentExercise.completed;

  var toggleComplete = (value) => {
    fetch(
      `http://localhost:5000/api/workouts/${currentWorkout._id}/exercises/${exerciseIndex}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: value }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWorkouts((prev) => {
            var copy = [...prev];
            var w = { ...copy[workoutIndex] };
            var exs = [...w.exercises];
            exs[exerciseIndex] = { ...exs[exerciseIndex], completed: value };
            w.exercises = exs;
            copy[workoutIndex] = w;
            return copy;
          });
        }
      })
      .catch(() => {});
  };

  var goNext = () => {
    if (!isLastExercise) {
      setExerciseIndex((i) => i + 1);
    } else if (workoutIndex < workouts.length - 1) {
      setWorkoutIndex((i) => i + 1);
      setExerciseIndex(0);
    }
  };

  var goPrev = () => {
    if (exerciseIndex > 0) {
      setExerciseIndex((i) => i - 1);
    } else if (workoutIndex > 0) {
      setWorkoutIndex((i) => i - 1);
      setExerciseIndex(workouts[workoutIndex - 1].exercises.length - 1);
    }
  };

  return (
    <div className="forge-session-page">
      <div className="forge-session-header">
        <p className="forge-session-eyebrow">{currentWorkout.workoutName}</p>
        <h1 className="forge-session-title">{currentExercise.exerciseName}</h1>
        <p className="forge-session-progress">
          Exercise {exerciseIndex + 1} of {totalExercises} · {doneCount}/{totalExercises} done
        </p>
        <div className="forge-session-bar">
          <div
            className="forge-session-bar-fill"
            style={{ width: `${(doneCount / totalExercises) * 100}%` }}
          />
        </div>
      </div>

      <div className="forge-session-card">
        <div className="forge-session-stats">
          <div>
            <span className="forge-session-stat-label">Sets</span>
            <span className="forge-session-stat-value">{currentExercise.sets}</span>
          </div>
          <div>
            <span className="forge-session-stat-label">Reps</span>
            <span className="forge-session-stat-value">{currentExercise.reps}</span>
          </div>
          {currentExercise.weight != null && (
            <div>
              <span className="forge-session-stat-label">Weight</span>
              <span className="forge-session-stat-value">{currentExercise.weight}</span>
            </div>
          )}
        </div>

        {currentExercise.notes && (
          <p className="forge-session-notes">{currentExercise.notes}</p>
        )}

        <button
          className={`forge-session-complete ${currentExercise.completed ? "done" : ""}`}
          onClick={() => toggleComplete(!currentExercise.completed)}
        >
          {currentExercise.completed ? "✓ Completed" : "Mark as Complete"}
        </button>
      </div>

      <div className="forge-session-nav">
        <button
          className="forge-session-nav-btn"
          onClick={goPrev}
          disabled={workoutIndex === 0 && exerciseIndex === 0}
        >
          Previous
        </button>

        {allWorkoutsDone ? (
          <button className="btn-forge-primary" onClick={() => navigate("/dashboard")}>
            Finish Session
          </button>
        ) : (
          <button className="btn-forge-primary" onClick={goNext}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}