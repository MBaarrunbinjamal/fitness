import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ProgressCard() {
  const [percent, setPercent] = useState(null);

  const token = (() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored).token : null;
  })();

  useEffect(() => {
    fetch("http://localhost:5000/api/progress/weekly", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPercent(data.percent);
      })
      .catch(() => {});
  }, [token]);

  return (
    <div className="dashboard-card" id="progress">
      <h3>Weekly Progress</h3> 

      <div className="progress-circle">
        {percent === null ? "..." : `${percent}%`}
      </div>

      <p className="mt-3">Workout Completion</p>

      <Link to="/progress" className="dashboard-card-link">
        View Full Report →
      </Link>
    </div>
  );
}

export default ProgressCard;    