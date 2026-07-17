function Previewcrd({title,desc}) {
  return (
    // <!-- ===== DASHBOARD PREVIEW CARDS ===== -->
<section className="pf-section pf-section-alt">
  <div className="container">
    <div className="pf-section-head text-center reveal-up">
      <span className="pf-eyebrow">Member Portal</span>
      <h2>What members see on their side</h2>
      <p className="pf-section-sub">A connected experience that keeps members engaged between visits.</p>
    </div>

    <div className="row g-4 mt-2">
      <div className="col-md-6 col-lg-4 reveal-up">
        <div className="glass-card pf-preview-card">
          <span className="pf-mock-icon bg-accent-10"><i className="bi bi-heart-pulse"></i></span>
          <h5>BMI Tracking</h5>
          <p>Log weight and height to auto-calculate BMI trends over time.</p>
        </div>
      </div>
      <div className="col-md-6 col-lg-4 reveal-up" style={{ "--d": ".05s" }}>
        <div className="glass-card pf-preview-card">
          <span className="pf-mock-icon bg-accent-10"><i className="bi bi-calendar-week"></i></span>
          <h5>Workout Schedule</h5>
          <p>Weekly training splits assigned by trainers, synced to the calendar.</p>
        </div>
      </div>
      <div className="col-md-6 col-lg-4 reveal-up" style={{ "--d": ".1s" }}>
        <div className="glass-card pf-preview-card">
          <span className="pf-mock-icon bg-accent-10"><i className="bi bi-egg-fried"></i></span>
          <h5>Diet Plans</h5>
          <p>Macro-balanced meal plans matched to each member's fitness goal.</p>
        </div>
      </div>
      <div className="col-md-6 col-lg-4 reveal-up" style={{ "--d": ".15s" }}>
        <div className="glass-card pf-preview-card">
          <span className="pf-mock-icon bg-accent-10"><i className="bi bi-patch-check"></i></span>
          <h5>Membership Status</h5>
          <p>Live plan status, renewal dates and upgrade options at a glance.</p>
        </div>
      </div>
      <div className="col-md-6 col-lg-4 reveal-up" style={{ "--d": ".2s" }}>
        <div className="glass-card pf-preview-card">
          <span className="pf-mock-icon bg-accent-10"><i className="bi bi-fire"></i></span>
          <h5>Calories</h5>
          <p>Daily calorie burn synced from wearables and workout logs.</p>
        </div>
      </div>
      <div className="col-md-6 col-lg-4 reveal-up" style={{ "--d": ".25s" }}>
        <div className="glass-card pf-preview-card">
          <span className="pf-mock-icon bg-accent-10"><i className="bi bi-bar-chart-line"></i></span>
          <h5>Progress</h5>
          <p>Before/after photos and strength metrics tracked side by side.</p>
        </div>
      </div>
    </div>
  </div>
</section>
  );
}
export default Previewcrd;