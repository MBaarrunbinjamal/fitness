import { useState, useEffect } from "react";
import "./Adminrequests.css";

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState(null);

  const token = (() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored).token : null;
  })();

  const fetchRequests = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/admin/requests", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRequests(data.requests);
        } else {
          setError(data.message || "Could not load requests.");
        }
      })
      .catch(() => setError("Could not load requests."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = (requestId, action) => {
    setActingId(requestId);
    fetch(`http://localhost:5000/api/admin/requests/${requestId}/${action}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetchRequests();
        } else {
          setError(data.message || `Could not ${action} request.`);
        }
      })
      .catch(() => setError(`Could not ${action} request.`))
      .finally(() => setActingId(null));
  };

  const pending = requests.filter((r) => r.status === "pending");
  const others = requests.filter((r) => r.status !== "pending");

  if (loading) {
    return (
      <div className="forge-requests-page">
        <p className="forge-requests-status">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="forge-requests-page">
      <div className="forge-requests-header">
        <h1>Subscription Requests</h1>
        <p>{pending.length} awaiting review</p>
      </div>

      {error && <p className="forge-error">{error}</p>}

      {pending.length === 0 ? (
        <p className="forge-requests-status">No pending requests.</p>
      ) : (
        <div className="forge-requests-list">
          {pending.map((r) => {
            const requester = r.userDetails?.[0];
            return (
              <div key={r._id} className="forge-request-card">
                <div className="forge-request-info">
                  <p className="forge-request-name">
                    {requester?.fullName || requester?.username || "Unknown user"}
                  </p>
                  <p className="forge-request-email">{requester?.email}</p>
                  <p className="forge-request-plan">
                    {r.subscriptionName} — {r.subscriptionDuration} days — {r.subscriptionPrice}
                  </p>
                  <p className="forge-request-address">{r.address}</p>
                </div>
                <div className="forge-request-actions">
                  <button
                    className="forge-accept-btn"
                    onClick={() => handleAction(r._id, "accept")}
                    disabled={actingId === r._id}
                  >
                    {actingId === r._id ? "..." : "Accept"}
                  </button>
                  <button
                    className="forge-reject-btn"
                    onClick={() => handleAction(r._id, "reject")}
                    disabled={actingId === r._id}
                  >
                    {actingId === r._id ? "..." : "Reject"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {others.length > 0 && (
        <>
          <h2 className="forge-requests-subheader">History</h2>
          <div className="forge-requests-list">
            {others.map((r) => {
              const requester = r.userDetails?.[0];
              return (
                <div key={r._id} className="forge-request-card forge-request-history">
                  <div className="forge-request-info">
                    <p className="forge-request-name">
                      {requester?.fullName || requester?.username || "Unknown user"}
                    </p>
                    <p className="forge-request-plan">{r.subscriptionName}</p>
                  </div>
                  <span className={`forge-status-badge forge-status-${r.status}`}>
                    {r.status}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}