import { useState } from "react";
import "./Workoutmodal.css";

var CATEGORIES = ["strength", "cardio", "flexibility", "hiit", "sports"];

var emptyExercise = { exerciseName: "", sets: "", reps: "", weight: "", notes: "" };

export default function WorkoutModal({ open, onClose, onCreated }) {
  var [workoutName, setWorkoutName] = useState("");
  var [category, setCategory] = useState("");
  var [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  var [reminderTime, setReminderTime] = useState("");
  var [tagInput, setTagInput] = useState("");
  var [tags, setTags] = useState([]);
  var [description, setDescription] = useState("");
  var [exercises, setExercises] = useState([{ ...emptyExercise }]);
  var [error, setError] = useState("");
  var [saving, setSaving] = useState(false);

  if (!open) return null;

  var token = (() => {
    var stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored).token : null;
  })();

  var resetForm = () => {
    setWorkoutName("");
    setCategory("");
    setDate(new Date().toISOString().slice(0, 10));
    setReminderTime("");
    setTagInput("");
    setTags([]);
    setDescription("");
    setExercises([{ ...emptyExercise }]);
    setError("");
  };

  var handleClose = () => {
    resetForm();
    onClose();
  };

  var addTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  var removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  var updateExercise = (index, field, value) => {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex))
    );
  };

  var addExerciseRow = () => {
    setExercises((prev) => [...prev, { ...emptyExercise }]);
  };

  var removeExerciseRow = (index) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  var handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!workoutName.trim() || !category) {
      setError("Workout name and category are required.");
      return;
    }

    var cleanedExercises = exercises.map((ex) => ({
      exerciseName: ex.exerciseName.trim(),
      sets: ex.sets === "" ? null : Number(ex.sets),
      reps: ex.reps === "" ? null : Number(ex.reps),
      weight: ex.weight === "" ? null : Number(ex.weight),
      notes: ex.notes,
    }));

    var invalidRow = cleanedExercises.find(
      (ex) => !ex.exerciseName || ex.sets == null || ex.reps == null
    );
    if (invalidRow) {
      setError("Each exercise needs a name, sets, and reps.");
      return;
    }

    setSaving(true);

    fetch("http://localhost:5000/api/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        workoutName: workoutName.trim(),
        category,
        date,
        reminderTime: reminderTime || undefined,
        tags,
        description,
        exercises: cleanedExercises,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (onCreated) onCreated(data.data);
          handleClose();
        } else {
          setError(data.message || "Could not create workout.");
        }
      })
      .catch(() => setError("Something went wrong. Please try again."))
      .finally(() => setSaving(false));
  };

  return (
    <div className="forge-modal-overlay" onClick={handleClose}>
      <div className="forge-modal" onClick={(e) => e.stopPropagation()}>
        <div className="forge-modal-header">
          <h2>Add New Workout</h2>
          <button className="forge-modal-close" onClick={handleClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="forge-modal-body">
          <div className="forge-field">
            <label className="forge-label">Workout Name</label>
            <input
              className="forge-input"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="e.g. Push Day"
            />
          </div>

          <div className="forge-field-row forge-field-row-3">
            <div className="forge-field">
              <label className="forge-label">Category</label>
              <select
                className="forge-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="forge-field">
              <label className="forge-label">Date</label>
              <input
                type="date"
                className="forge-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="forge-field">
              <label className="forge-label">Tags</label>
              <input
                className="forge-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="Type & press Enter"
              />
            </div>
          </div>

          {tags.length > 0 && (
            <div className="forge-tag-list">
              {tags.map((tag) => (
                <span key={tag} className="forge-tag">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="forge-field">
            <label className="forge-label">Description</label>
            <textarea
              className="forge-input forge-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional notes about this workout"
              rows={2}
            />
          </div>

          <div className="forge-field">
            <label className="forge-label">Remind me at (optional)</label>
            <input
              type="time"
              className="forge-input"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>

          <div className="forge-exercises-header">
            <h3>Exercises</h3>
            <button type="button" className="forge-add-exercise" onClick={addExerciseRow}>
              + Add Exercise
            </button>
          </div>

          <div className="forge-exercise-list">
            {exercises.map((ex, index) => (
              <div className="forge-exercise-row" key={index}>
                <input
                  className="forge-input forge-exercise-name"
                  placeholder="Exercise name"
                  value={ex.exerciseName}
                  onChange={(e) => updateExercise(index, "exerciseName", e.target.value)}
                />
                <input
                  className="forge-input forge-exercise-small"
                  placeholder="Sets"
                  type="number"
                  value={ex.sets}
                  onChange={(e) => updateExercise(index, "sets", e.target.value)}
                />
                <input
                  className="forge-input forge-exercise-small"
                  placeholder="Reps"
                  type="number"
                  value={ex.reps}
                  onChange={(e) => updateExercise(index, "reps", e.target.value)}
                />
                <input
                  className="forge-input forge-exercise-small"
                  placeholder="Weight"
                  type="number"
                  value={ex.weight}
                  onChange={(e) => updateExercise(index, "weight", e.target.value)}
                />
                <input
                  className="forge-input forge-exercise-notes"
                  placeholder="Notes"
                  value={ex.notes}
                  onChange={(e) => updateExercise(index, "notes", e.target.value)}
                />
                {exercises.length > 1 && (
                  <button
                    type="button"
                    className="forge-remove-exercise"
                    onClick={() => removeExerciseRow(index)}
                    aria-label="Remove exercise"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M18 6 6 18" />
                      <path d="M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {error && <p className="forge-error">{error}</p>}

          <div className="forge-modal-actions">
            <button type="button" className="forge-modal-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-forge-primary" disabled={saving}>
              {saving ? "Saving..." : "Create Workout"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}