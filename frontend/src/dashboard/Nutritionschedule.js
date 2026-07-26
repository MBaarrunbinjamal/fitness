import { useState, useEffect, useMemo } from "react";
import "./Nutritionschedule.css";
import DashboardNavbar from "../dashboard/DashboardNavbar";

var MEAL_ORDER = ["Breakfast", "Lunch", "Dinner", "Snack"];

export default function NutritionSchedule() {
  var [days, setDays] = useState([]);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState("");

  var [fromDate, setFromDate] = useState("");
  var [toDate, setToDate] = useState("");

  var [modalOpen, setModalOpen] = useState(false);
  var [modalDate, setModalDate] = useState(null);
  var [modalLogs, setModalLogs] = useState([]);
  var [modalLoading, setModalLoading] = useState(false);
  var [modalError, setModalError] = useState("");

  var token = (() => {
    var stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored).token : null;
  })();

  useEffect(() => {
    fetch("http://localhost:5000/api/nutrition/history", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDays(data.days);
        } else {
          setError(data.message || "Could not load nutrition history.");
        }
      })
      .catch(() => setError("Could not load nutrition history."))
      .finally(() => setLoading(false));
  }, [token]);

  var formatDate = (isoDay) =>
    new Date(isoDay).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  var filteredDays = useMemo(() => {
    return days.filter((d) => {
      var dayDate = new Date(d._id);
      if (fromDate && dayDate < new Date(fromDate)) return false;
      if (toDate && dayDate > new Date(toDate)) return false;
      return true;
    });
  }, [days, fromDate, toDate]);

  var openDay = (isoDay) => {
    setModalDate(isoDay);
    setModalOpen(true);
    setModalLoading(true);
    setModalError("");
    setModalLogs([]);

    fetch(`http://localhost:5000/api/nutrition/date/${isoDay}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setModalLogs(data.logs);
        } else {
          setModalError(data.message || "Could not load that day's food log.");
        }
      })
      .catch(() => setModalError("Could not load that day's food log."))
      .finally(() => setModalLoading(false));
  };

  var closeModal = () => {
    setModalOpen(false);
    setModalDate(null);
    setModalLogs([]);
    setModalError("");
  };

  var groupedByMeal = MEAL_ORDER.map((meal) => ({
    meal,
    items: modalLogs.filter((log) => log.mealType === meal),
  })).filter((group) => group.items.length > 0);

  if (loading) {
    return (
      <div className="forge-schedule-page">
        <p className="forge-schedule-status">Loading nutrition history...</p>
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
          <h1>Nutrition History</h1>
          <p>Daily totals, most recent first. Tap a day to see the breakdown.</p>
        </div>

        <div className="forge-filter-bar">
          <div className="forge-filter-date-group">
            <label className="forge-filter-date-label">From</label>
            <input
              type="date"
              className="forge-filter-select"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="forge-filter-date-group">
            <label className="forge-filter-date-label">To</label>
            <input
              type="date"
              className="forge-filter-select"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          {(fromDate || toDate) && (
            <button
              className="forge-filter-clear"
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
            >
              Clear
            </button>
          )}
        </div>

        {filteredDays.length === 0 ? (
          <p className="forge-schedule-status">
            {days.length === 0 ? "No nutrition logged yet." : "No days match this date range."}
          </p>
        ) : (
          <div className="forge-schedule-table-wrap">
            <table className="forge-schedule-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Calories</th>
                  <th>Protein</th>
                  <th>Carbs</th>
                  <th>Fat</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredDays.map((d) => (
                  <tr key={d._id}>
                    <td>{formatDate(d._id)}</td>
                    <td>{d.calories.toFixed(0)} kcal</td>
                    <td>{d.protein.toFixed(1)} g</td>
                    <td>{d.carbs.toFixed(1)} g</td>
                    <td>{d.fat.toFixed(1)} g</td>
                    <td>
                      <button
                        className="btn-forge-primary forge-schedule-start"
                        onClick={() => openDay(d._id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {modalOpen && (
          <div className="forge-modal-overlay" onClick={closeModal}>
            <div className="forge-modal" onClick={(e) => e.stopPropagation()}>
              <div className="forge-modal-header">
                <h2>{modalDate ? formatDate(modalDate) : ""}</h2>
                <button className="forge-modal-close" onClick={closeModal} aria-label="Close">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6 6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="forge-modal-body">
                {modalLoading && <p className="forge-schedule-status">Loading...</p>}
                {!modalLoading && modalError && <p className="forge-error">{modalError}</p>}

                {!modalLoading && !modalError && groupedByMeal.length === 0 && (
                  <p className="forge-schedule-status">No food logged for this day.</p>
                )}

                {!modalLoading &&
                  !modalError &&
                  groupedByMeal.map((group) => (
                    <div key={group.meal} className="forge-meal-group">
                      <h3 className="forge-meal-title">{group.meal}</h3>
                      <ul className="forge-meal-list">
                        {group.items.map((item) => (
                          <li key={item._id} className="forge-meal-item">
                            <div className="forge-meal-item-name">
                              {item.foodName} <span>({item.grams}g)</span>
                            </div>
                            <div className="forge-meal-item-macros">
                              <span>{item.calories} kcal</span>
                              <span>{item.protein}g protein</span>
                              <span>{item.carbs}g carbs</span>
                              <span>{item.fat}g fat</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}