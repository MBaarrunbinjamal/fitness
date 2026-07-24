import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  var [form, setForm] = useState({
    username: "",
    fullName: "",
    height: "",
    weight: "",
    dateOfBirth: "",
    gender: "",
    fitnessGoal: "",
    activityLevel: "",
    experienceLevel: "",
    targetWeight: "",
    unitPreference: "metric",
  });

  var [profilePicture, setProfilePicture] = useState(null); // existing pic URL
  var [previewUrl, setPreviewUrl] = useState(null); // new pic preview
  var [selectedFile, setSelectedFile] = useState(null);

  var [loading, setLoading] = useState(true);
  var [saving, setSaving] = useState(false);
  var [error, setError] = useState("");
  var [success, setSuccess] = useState("");
  var fileInputRef = useRef(null);
  var navigate = useNavigate();

  var token = (() => {
    var stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored).token : null;
  })();

  useEffect(() => {
    fetch("http://localhost:5000/api/getuser", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          var u = data.user;
          setForm({
            username: u.username || "",
            fullName: u.fullName || "",
            height: u.height || "",
            weight: u.weight || "",
            dateOfBirth: u.dateOfBirth ? u.dateOfBirth.slice(0, 10) : "",
            gender: u.gender || "",
            fitnessGoal: u.fitnessGoal || "",
            activityLevel: u.activityLevel || "",
            experienceLevel: u.experienceLevel || "",
            targetWeight: u.targetWeight || "",
            unitPreference: u.unitPreference || "metric",
          });
          if (u.profilePicture) setProfilePicture(u.profilePicture);
        } else {
          setError(data.message || "Could not load profile.");
        }
      })
      .catch(() => setError("Could not load profile."))
      .finally(() => setLoading(false));
  }, [token]);

  var handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  var handleFileChange = (e) => {
    var file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  var handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    var formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }

    fetch("http://localhost:5000/api/update", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccess("Profile updated successfully.");
          setProfilePicture(data.user.profilePicture || null);
          setSelectedFile(null);
          setPreviewUrl(null);
        } else {
          setError(data.message || "Update failed.");
        }
      })
      .catch(() => setError("Something went wrong. Please try again."))
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div className="forge-profile-page">
        <p className="forge-profile-loading">Loading profile...</p>
      </div>
    );
  }

  var avatarSrc = previewUrl
    ? previewUrl
    : profilePicture
    ? `http://localhost:5000${profilePicture}`
    : "https://i.pravatar.cc/160?img=12";

  return (
    <div className="forge-profile-page">
      <button
        type="button"
        className="forge-floating-back"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <div className="forge-profile-hero">
        <div className="forge-profile-avatar-wrap">
          <img src={avatarSrc} alt="Profile" className="forge-profile-avatar" />
          <button
            type="button"
            className="forge-profile-avatar-edit"
            onClick={() => fileInputRef.current.click()}
            aria-label="Change profile picture"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            hidden
          />
        </div>
        <div>
          <p className="forge-profile-eyebrow">Your Account</p>
          <h1 className="forge-profile-title">{form.fullName || form.username || "Your Profile"}</h1>
          <p className="forge-profile-sub">Keep your details up to date to get the most accurate plans.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="forge-profile-grid">
        <div className="forge-profile-card">
          <h2 className="forge-card-title">Basic Info</h2>

          <div className="forge-field">
            <label className="forge-label" htmlFor="username">Username</label>
            <input
              id="username"
              className="forge-input"
              value={form.username}
              onChange={handleChange("username")}
            />
          </div>

          <div className="forge-field">
            <label className="forge-label" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              className="forge-input"
              value={form.fullName}
              onChange={handleChange("fullName")}
            />
          </div>

          <div className="forge-field-row">
            <div className="forge-field">
              <label className="forge-label" htmlFor="dateOfBirth">Date of Birth</label>
              <input
                id="dateOfBirth"
                type="date"
                className="forge-input"
                value={form.dateOfBirth}
                onChange={handleChange("dateOfBirth")}
              />
            </div>
            <div className="forge-field">
              <label className="forge-label" htmlFor="gender">Gender</label>
              <select
                id="gender"
                className="forge-input"
                value={form.gender}
                onChange={handleChange("gender")}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="forge-profile-card">
          <h2 className="forge-card-title">Body Stats</h2>

          <div className="forge-field-row">
            <div className="forge-field">
              <label className="forge-label" htmlFor="height">Height ({form.unitPreference === "imperial" ? "in" : "cm"})</label>
              <input
                id="height"
                type="number"
                className="forge-input"
                value={form.height}
                onChange={handleChange("height")}
              />
            </div>
            <div className="forge-field">
              <label className="forge-label" htmlFor="weight">Weight ({form.unitPreference === "imperial" ? "lb" : "kg"})</label>
              <input
                id="weight"
                type="number"
                className="forge-input"
                value={form.weight}
                onChange={handleChange("weight")}
              />
            </div>
          </div>

          <div className="forge-field-row">
            <div className="forge-field">
              <label className="forge-label" htmlFor="targetWeight">Target Weight</label>
              <input
                id="targetWeight"
                type="number"
                className="forge-input"
                value={form.targetWeight}
                onChange={handleChange("targetWeight")}
              />
            </div>
            <div className="forge-field">
              <label className="forge-label" htmlFor="unitPreference">Units</label>
              <select
                id="unitPreference"
                className="forge-input"
                value={form.unitPreference}
                onChange={handleChange("unitPreference")}
              >
                <option value="metric">Metric (kg/cm)</option>
                <option value="imperial">Imperial (lb/in)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="forge-profile-card">
          <h2 className="forge-card-title">Training Profile</h2>

          <div className="forge-field">
            <label className="forge-label" htmlFor="fitnessGoal">Fitness Goal</label>
            <select
              id="fitnessGoal"
              className="forge-input"
              value={form.fitnessGoal}
              onChange={handleChange("fitnessGoal")}
            >
              <option value="">Select a goal</option>
              <option value="lose_weight">Lose Weight</option>
              <option value="build_muscle">Build Muscle</option>
              <option value="maintain">Maintain</option>
              <option value="improve_endurance">Improve Endurance</option>
            </select>
          </div>

          <div className="forge-field-row">
            <div className="forge-field">
              <label className="forge-label" htmlFor="activityLevel">Activity Level</label>
              <select
                id="activityLevel"
                className="forge-input"
                value={form.activityLevel}
                onChange={handleChange("activityLevel")}
              >
                <option value="">Select</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Lightly Active</option>
                <option value="moderate">Moderately Active</option>
                <option value="active">Very Active</option>
              </select>
            </div>
            <div className="forge-field">
              <label className="forge-label" htmlFor="experienceLevel">Experience Level</label>
              <select
                id="experienceLevel"
                className="forge-input"
                value={form.experienceLevel}
                onChange={handleChange("experienceLevel")}
              >
                <option value="">Select</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {error && <p className="forge-error forge-profile-message">{error}</p>}
        {success && <p className="forge-success forge-profile-message">{success}</p>}

        <div className="forge-profile-actions">
          <button type="submit" className="forge-submit forge-profile-save" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}