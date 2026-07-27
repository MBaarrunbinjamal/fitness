import { useState } from "react";
import "./Support.css";
import DashboardNavbar from "../dashboard/DashboardNavbar";

const TABS = [
  { key: "contact", label: "Contact Us" },
  { key: "feedback", label: "Feedback" },
  { key: "complaint", label: "Complaint" },
];

export default function Support() {
  const [activeTab, setActiveTab] = useState("contact");

  const token = (() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored).token : null;
  })();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");

  const [complaintText, setComplaintText] = useState("");

  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const switchTab = (key) => {
    setActiveTab(key);
    setStatus({ type: "", message: "" });
  };

  const submitContact = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ type: "error", message: "Please fill in all fields." });
      return;
    }
    setSubmitting(true);
    fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus({ type: "success", message: "Message sent. We'll get back to you soon." });
          setName(""); setEmail(""); setMessage("");
        } else {
          setStatus({ type: "error", message: data.message || "Could not send message." });
        }
      })
      .catch(() => setStatus({ type: "error", message: "Something went wrong." }))
      .finally(() => setSubmitting(false));
  };

  const submitFeedback = (e) => {
    e.preventDefault();
    if (!rating) {
      setStatus({ type: "error", message: "Please select a rating." });
      return;
    }
    setSubmitting(true);
    fetch("http://localhost:5000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ rating, comments: comments.trim() }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus({ type: "success", message: "Thanks for your feedback!" });
          setRating(0); setComments("");
        } else {
          setStatus({ type: "error", message: data.message || "Could not submit feedback." });
        }
      })
      .catch(() => setStatus({ type: "error", message: "Something went wrong." }))
      .finally(() => setSubmitting(false));
  };

  const submitComplaint = (e) => {
    e.preventDefault();
    if (!complaintText.trim()) {
      setStatus({ type: "error", message: "Please describe your complaint." });
      return;
    }
    setSubmitting(true);
    fetch("http://localhost:5000/api/complain", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ complaintText: complaintText.trim() }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus({ type: "success", message: "Complaint registered. We'll review it shortly." });
          setComplaintText("");
        } else {
          setStatus({ type: "error", message: data.message || "Could not register complaint." });
        }
      })
      .catch(() => setStatus({ type: "error", message: "Something went wrong." }))
      .finally(() => setSubmitting(false));
  };

  return (
    <>
      <DashboardNavbar />
      <div className="forge-support-page">
        <div className="forge-support-header">
          <h1>Support</h1>
          <p>Reach out, share feedback, or let us know if something's wrong.</p>
        </div>

        <div className="forge-support-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`forge-support-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => switchTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="forge-support-card">
          {status.message && (
            <p className={status.type === "success" ? "forge-success" : "forge-error"}>
              {status.message}
            </p>
          )}

          {activeTab === "contact" && (
            <form onSubmit={submitContact} noValidate>
              <div className="forge-field">
                <label className="forge-label">Name</label>
                <input
                  className="forge-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="forge-field">
                <label className="forge-label">Email</label>
                <input
                  className="forge-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="forge-field">
                <label className="forge-label">Message</label>
                <textarea
                  className="forge-input forge-textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  rows={4}
                />
              </div>
              <button type="submit" className="btn-forge-primary" disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}

          {activeTab === "feedback" && (
            <form onSubmit={submitFeedback} noValidate>
              <div className="forge-field">
                <label className="forge-label">Rating</label>
                <div className="forge-rating-stars">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`forge-star ${n <= rating ? "filled" : ""}`}
                      onClick={() => setRating(n)}
                      aria-label={`Rate ${n} stars`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="forge-field">
                <label className="forge-label">Comments (optional)</label>
                <textarea
                  className="forge-input forge-textarea"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Tell us what you think"
                  rows={4}
                />
              </div>
              <button type="submit" className="btn-forge-primary" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          )}

          {activeTab === "complaint" && (
            <form onSubmit={submitComplaint} noValidate>
              <div className="forge-field">
                <label className="forge-label">Describe the issue</label>
                <textarea
                  className="forge-input forge-textarea"
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  placeholder="What went wrong?"
                  rows={5}
                />
              </div>
              <button type="submit" className="btn-forge-primary" disabled={submitting}>
                {submitting ? "Submitting..." : "Register Complaint"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}