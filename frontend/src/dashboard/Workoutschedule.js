import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Workoutschedule.css";
import DashboardNavbar from "../dashboard/DashboardNavbar";

function getStatus(workout, todayStr) {
  var workoutDateStr = new Date(workout.date).toDateString();
  var totalExercises = workout.exercises?.length || 0;
  var doneCount = workout.exercises?.filter((ex) => ex.completed).length || 0;
  var allDone = totalExercises > 0 && doneCount === totalExercises;

  if (allDone) return "completed";
  if (workoutDateStr === todayStr) return "today";
  if (new Date(workout.date) < new Date(todayStr)) return "missed";
  return "upcoming";
}

var STATUS_LABEL = {
  completed: "Completed",
  today: "Today",
  missed: "Missed",
  upcoming: "Upcoming",
};

export default function WorkoutSchedule() {
  var [workouts, setWorkouts] = useState([]);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState("");
  var [searchTerm, setSearchTerm] = useState("");
  var [categoryFilter, setCategoryFilter] = useState("all");
  var [statusFilter, setStatusFilter] = useState("all");
  var navigate = useNavigate();

  var token = (() => {
    var stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored).token : null;
  })();

  useEffect(() => {
    fetch("http://localhost:5000/api/workouts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWorkouts(data.workouts);
        } else {
          setError(data.message || "Could not load your schedule.");
        }
      })
      .catch(() => setError("Could not load your schedule."))
      .finally(() => setLoading(false));
  }, [token]);

  var todayStr = new Date().toDateString();

  var withStatus = useMemo(() => {
    return workouts
      .map((w) => ({ ...w, status: getStatus(w, todayStr) }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [workouts, todayStr]);

  var categories = useMemo(() => {
    var set = new Set(withStatus.map((w) => w.category).filter(Boolean));
    return Array.from(set);
  }, [withStatus]);

  var filteredWorkouts = useMemo(() => {
    return withStatus.filter((w) => {
      var matchesSearch = w.workoutName.toLowerCase().includes(searchTerm.trim().toLowerCase());
      var matchesCategory = categoryFilter === "all" || w.category === categoryFilter;
      var matchesStatus = statusFilter === "all" || w.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [withStatus, searchTerm, categoryFilter, statusFilter]);

  var formatDate = (d) =>
    new Date(d).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  if (loading) {
    return (
      <div className="forge-schedule-page">
        <p className="forge-schedule-status">Loading your schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="forge-schedule-page">
        <p className="forge-schedule-status forge-error">{error}</p>
      </div>
    );
  }

  return (
    <>
      <DashboardNavbar />
      <div className="forge-schedule-page">
        <div className="forge-schedule-header">
          <h1>Workout Schedule</h1>
          <p>All your logged and upcoming workouts, most recent first.</p>
        </div>

        <div className="forge-filter-bar">
          <input
            type="text"
            className="forge-filter-search"
            placeholder="Search workouts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="forge-filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            className="forge-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
          </select>

          {(searchTerm || categoryFilter !== "all" || statusFilter !== "all") && (
            <button
              className="forge-filter-clear"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setStatusFilter("all");
              }}
            >
              Clear
            </button>
          )}
        </div>

        {filteredWorkouts.length === 0 ? (
          <p className="forge-schedule-status">
            {workouts.length === 0 ? "No workouts logged yet." : "No workouts match your filters."}
          </p>
        ) : (
          <div className="forge-schedule-table-wrap">
            <table className="forge-schedule-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Workout</th>
                  <th>Category</th>
                  <th>Exercises</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkouts.map((w) => (
                  <tr key={w._id} className={`forge-row-${w.status}`}>
                    <td>{formatDate(w.date)}</td>
                    <td className="forge-schedule-name">{w.workoutName}</td>
                    <td className="forge-schedule-category">{w.category}</td>
                    <td>{w.exercises?.length || 0}</td>
                    <td>
                      <span className={`forge-status-badge forge-status-${w.status}`}>
                        {STATUS_LABEL[w.status]}
                      </span>
                    </td>
                    <td>
                      {w.status === "today" && (
                        <button
                          className="btn-forge-primary forge-schedule-start"
                          onClick={() => navigate("/workout-session")}
                        >
                          Start Workout
                        </button>
                      )}
                      {w.status === "upcoming" && (
                        <span className="forge-schedule-muted">Not yet</span>
                      )}
                      {w.status === "completed" && (
                        <span className="forge-schedule-muted">✓ Done</span>
                      )}
                      {w.status === "missed" && (
                        <span className="forge-schedule-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}