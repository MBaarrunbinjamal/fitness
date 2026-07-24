import { useState, useEffect } from "react";
import "./Allusers.css";
import Navbar from "../Admindash/Navbar";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const token = (() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored).token : null;
  })();

  const fetchUsers = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.message || "Could not load users.");
        }
      })
      .catch(() => setError("Could not load users."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (userId) => {
    setDeletingId(userId);
    fetch(`http://localhost:5000/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers((prev) => prev.filter((u) => u._id !== userId));
        } else {
          setError(data.message || "Could not delete user.");
        }
      })
      .catch(() => setError("Could not delete user."))
      .finally(() => {
        setDeletingId(null);
        setConfirmId(null);
      });
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—";

  if (loading) {
    return (
      <div className="forge-users-page">
        <p className="forge-users-status">Loading users...</p>
      </div>
    );
  }

  return (
   <>
   <Navbar/>
    <div className="forge-users-page">
      <div className="forge-users-header">
        <h1>All Users</h1>
        <p>{users.length} registered {users.length === 1 ? "user" : "users"}</p>
      </div>

      {error && <p className="forge-error">{error}</p>}

      {users.length === 0 ? (
        <p className="forge-users-status">No users found.</p>
      ) : (
        <div className="forge-users-table-wrap">
          <table className="forge-users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Subscriber</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="forge-users-identity">
                      <img
                        src={
                          u.profilePicture
                            ? `http://localhost:5000${u.profilePicture}`
                            : "https://i.pravatar.cc/60?u=" + u._id
                        }
                        alt=""
                        className="forge-users-avatar"
                      />
                      <div>
                        <div className="forge-users-name">{u.fullName || u.username}</div>
                        <div className="forge-users-username">@{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`forge-role-badge forge-role-${u.role || "user"}`}>
                      {u.role || "user"}
                    </span>
                  </td>
                  <td>
                    <span className={`forge-status-dot ${u.isVerified ? "verified" : "pending"}`} />
                    {u.isVerified ? "Verified" : "Pending"}
                  </td>
                  <td>{u.subscriber ? "Yes" : "No"}</td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>
                    {confirmId === u._id ? (
                      <div className="forge-confirm-row">
                        <button
                          className="forge-confirm-yes"
                          onClick={() => handleDelete(u._id)}
                          disabled={deletingId === u._id}
                        >
                          {deletingId === u._id ? "..." : "Confirm"}
                        </button>
                        <button
                          className="forge-confirm-no"
                          onClick={() => setConfirmId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="forge-users-delete"
                        onClick={() => setConfirmId(u._id)}
                        aria-label="Delete user"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        </svg>
                      </button>
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