import { useState, useEffect } from "react";
import "./Adminsupport.css";
import Navbar from "../Admindash/Navbar";

const TABS = [
  { key: "contacts", label: "Contact Messages" },
  { key: "feedback", label: "Feedback" },
  { key: "complaints", label: "Complaints" },
];

export default function AdminSupport() {
  const [activeTab, setActiveTab] = useState("contacts");
  const [contacts, setContacts] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const token = (() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored).token : null;
  })();

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost:5000/api/admin/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch("http://localhost:5000/api/admin/feedback", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch("http://localhost:5000/api/admin/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    ])
      .then(([contactsData, feedbackData, complaintsData]) => {
        if (contactsData.success) setContacts(contactsData.contacts);
        if (feedbackData.success) setFeedback(feedbackData.feedback);
        if (complaintsData.success) setComplaints(complaintsData.complaints);
      })
      .catch(() => setError("Could not load support data."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const updateStatus = (complaintId, status) => {
    setUpdatingId(complaintId);
    fetch(`http://localhost:5000/api/admin/complaints/${complaintId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setComplaints((prev) =>
            prev.map((c) => (c._id === complaintId ? { ...c, status } : c))
          );
        }
      })
      .catch(() => {})
      .finally(() => setUpdatingId(null));
  };

  const formatDate = (d) => new Date(d).toLocaleString();

  return (
    <>
      <Navbar />
      <div className="forge-adminsupport-page">
        <div className="forge-adminsupport-header">
          <h1>Support Center</h1>
          <p>Contact messages, feedback, and complaints from users.</p>
        </div>

        <div className="forge-adminsupport-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`forge-adminsupport-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tab.key === "complaints" && complaints.filter((c) => c.status === "Pending").length > 0 && (
                <span className="forge-tab-badge">
                  {complaints.filter((c) => c.status === "Pending").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading && <p className="forge-adminsupport-status">Loading...</p>}
        {error && <p className="forge-error">{error}</p>}

        {!loading && activeTab === "contacts" && (
          contacts.length === 0 ? (
            <p className="forge-adminsupport-status">No contact messages yet.</p>
          ) : (
            <div className="forge-adminsupport-list">
              {contacts.map((c) => (
                <div key={c._id} className="forge-adminsupport-card">
                  <div className="forge-adminsupport-card-top">
                    <p className="forge-adminsupport-name">{c.name}</p>
                    <p className="forge-adminsupport-date">{formatDate(c.date)}</p>
                  </div>
                  <p className="forge-adminsupport-email">{c.email}</p>
                  <p className="forge-adminsupport-body">{c.message}</p>
                </div>
              ))}
            </div>
          )
        )}

        {!loading && activeTab === "feedback" && (
          feedback.length === 0 ? (
            <p className="forge-adminsupport-status">No feedback yet.</p>
          ) : (
            <div className="forge-adminsupport-list">
              {feedback.map((f) => (
                <div key={f._id} className="forge-adminsupport-card">
                  <div className="forge-adminsupport-card-top">
                    <p className="forge-adminsupport-name">{f.username}</p>
                    <p className="forge-adminsupport-date">{formatDate(f.date)}</p>
                  </div>
                  <div className="forge-adminsupport-stars">
                    {"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}
                  </div>
                  {f.comments && <p className="forge-adminsupport-body">{f.comments}</p>}
                </div>
              ))}
            </div>
          )
        )}

        {!loading && activeTab === "complaints" && (
          complaints.length === 0 ? (
            <p className="forge-adminsupport-status">No complaints yet.</p>
          ) : (
            <div className="forge-adminsupport-list">
              {complaints.map((c) => (
                <div key={c._id} className="forge-adminsupport-card">
                  <div className="forge-adminsupport-card-top">
                    <p className="forge-adminsupport-name">{c.username}</p>
                    <p className="forge-adminsupport-date">{formatDate(c.date)}</p>
                  </div>
                  <p className="forge-adminsupport-body">{c.complaintText}</p>
                  <div className="forge-adminsupport-status-row">
                    <span className={`forge-status-badge forge-status-${c.status.toLowerCase().replace(" ", "-")}`}>
                      {c.status}
                    </span>
                    <select
                      className="forge-status-select"
                      value={c.status}
                      onChange={(e) => updateStatus(c._id, e.target.value)}
                      disabled={updatingId === c._id}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </>
  );
}