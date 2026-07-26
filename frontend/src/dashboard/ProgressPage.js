import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Legend
} from "recharts";
import "./ProgressPage.css";
import DashboardNavbar from "./DashboardNavbar";

const ORANGE = "#ff6a1a";
const ORANGE_LIGHT = "#ff8a3d";
const GRAY = "#3a3a40";
const CHART_COLORS = ["#ff6a1a", "#ff8a3d", "#e0a94e", "#4caf6a"];

export default function ProgressPage() {
  const [report, setReport] = useState(null);
  const [nutritionHistory, setNutritionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(null);
  const [emailStatus, setEmailStatus] = useState("");

  const token = (() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored).token : null;
  })();

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/progress-report", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch("http://localhost:5000/api/nutrition/history", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    ])
      .then(([reportData, historyData]) => {
        if (reportData.success) setReport(reportData.report);
        else setError(reportData.message || "Could not load progress.");
        if (historyData.success) setNutritionHistory(historyData.days.slice(0, 14).reverse());
      })
      .catch(() => setError("Could not load progress."))
      .finally(() => setLoading(false));
  }, [token]);

  const downloadFile = (type) => {
    setDownloading(type);
    fetch(`http://localhost:5000/api/progress-report/${type}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `progress-report.${type}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => setError(`Could not download ${type.toUpperCase()}.`))
      .finally(() => setDownloading(null));
  };

  const emailReport = () => {
    setEmailStatus("sending");
    fetch("http://localhost:5000/api/progress-report/email", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setEmailStatus(data.success ? "sent" : "error");
      })
      .catch(() => setEmailStatus("error"));
  };

  if (loading) {
    return (
      <div className="forge-progress-page">
        <p className="forge-progress-status">Loading your progress...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="forge-progress-page">
        <p className="forge-progress-status forge-error">{error || "No data available."}</p>
      </div>
    );
  }

  const workoutCompletionData = [
    { name: "Completed", value: report.completedWorkoutsCount },
    { name: "Remaining", value: Math.max(0, report.totalWorkouts - report.completedWorkoutsCount) },
  ];

  const categoryBreakdown = Object.values(
    report.completedWorkouts.reduce((acc, w) => {
      acc[w.category] = acc[w.category] || { category: w.category, count: 0 };
      acc[w.category].count += 1;
      return acc;
    }, {})
  );

  const macroData = [
    { name: "Protein", value: report.nutritionTotals.protein },
    { name: "Carbs", value: report.nutritionTotals.carbs },
    { name: "Fat", value: report.nutritionTotals.fat },
  ];

  const calorieTrend = nutritionHistory.map((d) => ({
    date: new Date(d._id).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    calories: Math.round(d.calories),
  }));

  return (
   <>
   <DashboardNavbar/>
    <div className="forge-progress-page">
      <div className="forge-progress-header">
        <div>
          <h1>Your Progress</h1>
          <p>A full breakdown of your workouts, nutrition, and plan progress.</p>
        </div>
        <div className="forge-progress-actions">
          <button
            className="btn-forge-primary"
            onClick={() => downloadFile("pdf")}
            disabled={downloading === "pdf"}
          >
            {downloading === "pdf" ? "..." : "Download PDF"}
          </button>
          <button
            className="forge-secondary-btn"
            onClick={() => downloadFile("docx")}
            disabled={downloading === "docx"}
          >
            {downloading === "docx" ? "..." : "Download Word"}
          </button>
          <button className="forge-secondary-btn" onClick={emailReport}>
            {emailStatus === "sending" ? "Sending..." : emailStatus === "sent" ? "Sent ✓" : "Email Me"}
          </button>
        </div>
      </div>

      {emailStatus === "error" && <p className="forge-error">Could not send email.</p>}

      <div className="forge-progress-summary-grid">
        <div className="forge-progress-summary-card">
          <p className="forge-summary-label">Workouts Logged</p>
          <p className="forge-summary-value">{report.totalWorkouts}</p>
        </div>
        <div className="forge-progress-summary-card">
          <p className="forge-summary-label">Workouts Completed</p>
          <p className="forge-summary-value">{report.completedWorkoutsCount}</p>
        </div>
        <div className="forge-progress-summary-card">
          <p className="forge-summary-label">Food Entries Logged</p>
          <p className="forge-summary-value">{report.nutritionLogsCount}</p>
        </div>
        <div className="forge-progress-summary-card">
          <p className="forge-summary-label">Total Calories</p>
          <p className="forge-summary-value">{Math.round(report.nutritionTotals.calories)}</p>
        </div>
      </div>

      {report.subscriptionProgress && (
        <div className="forge-progress-card forge-plan-progress-card">
          <h2>Subscription Plan Progress</h2>
          <p className="forge-plan-progress-name">{report.subscriptionProgress.planName}</p>
          <div className="forge-plan-progress-bar">
            <div
              className="forge-plan-progress-fill"
              style={{ width: `${report.subscriptionProgress.percentComplete}%` }}
            />
          </div>
          <p className="forge-plan-progress-text">
            {report.subscriptionProgress.daysCompleted} / {report.subscriptionProgress.totalDays} days
            ({report.subscriptionProgress.percentComplete}%)
          </p>
        </div>
      )}

      <div className="forge-charts-grid">
        <div className="forge-progress-card">
          <h2>Workout Completion</h2>
          {report.totalWorkouts === 0 ? (
            <p className="forge-chart-empty">No workouts logged yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={workoutCompletionData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  <Cell fill={ORANGE} />
                  <Cell fill={GRAY} />
                </Pie>
                <Tooltip contentStyle={{ background: "#121215", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="forge-progress-card">
          <h2>Completed by Category</h2>
          {categoryBreakdown.length === 0 ? (
            <p className="forge-chart-empty">No completed workouts yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="category" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#121215", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
                <Bar dataKey="count" fill={ORANGE} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="forge-progress-card">
          <h2>Macro Breakdown</h2>
          {report.nutritionLogsCount === 0 ? (
            <p className="forge-chart-empty">No nutrition logged yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={macroData} dataKey="value" nameKey="name" outerRadius={80}>
                  {macroData.map((entry, i) => (
                    <Cell key={entry.name} fill={CHART_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#121215", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#ccc" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="forge-progress-card">
          <h2>Calorie Trend (last 14 days)</h2>
          {calorieTrend.length === 0 ? (
            <p className="forge-chart-empty">No nutrition history yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={calorieTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Tooltip contentStyle={{ background: "#121215", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="calories" stroke={ORANGE_LIGHT} strokeWidth={2} dot={{ fill: ORANGE }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {report.completedWorkouts.length > 0 && (
        <div className="forge-progress-card">
          <h2>Completed Workouts</h2>
          <ul className="forge-progress-list">
            {report.completedWorkouts.map((w) => (
              <li key={w._id}>
                <span className="forge-progress-list-name">{w.workoutName}</span>
                <span className="forge-progress-list-meta">
                  {w.category} · {new Date(w.date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
   </>
  );
}