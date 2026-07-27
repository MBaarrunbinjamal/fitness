function Features () {
    return(
        // <!-- ===== FEATURES ===== -->
<section id="features" className="pf-section">
  <div className="container">
    <div className="pf-section-head text-center reveal-up">
      <span className="pf-eyebrow">Dashboard Features</span>
      <h2>Everything your gym operations need</h2>
      <p className="pf-section-sub">One dashboard to run the entire facility — from the front desk to the balance sheet.</p>
    </div>

    <div className="row g-4 mt-2">
      <div className="col-md-6 col-lg-3 reveal-up">
        <div className="pf-feature-card">
          <span className="pf-feature-icon"><i className="bi bi-people-fill"></i></span>
          <h5>Members</h5>
          <p>Onboard, search and manage every member profile and plan from one screen.</p>
        </div>
      </div>
      <div className="col-md-6 col-lg-3 reveal-up" style={{ "--d": ".05s" }}>
        <div className="pf-feature-card">
          <span className="pf-feature-icon"><i className="bi bi-person-badge-fill"></i></span>
          <h5>Trainer Management</h5>
          <p>Assign trainers, track sessions and monitor client progress in real time.</p>
        </div>
      </div>
      {/* <div className="col-md-6 col-lg-3 reveal-up" style={{ "--d": ".1s" }}>
        <div className="pf-feature-card">
          <span className="pf-feature-icon"><i className="bi bi-calendar2-check-fill"></i></span>
          <h5>Attendance</h5>
          <p>Automated check-ins with biometric or QR support and live floor counts.</p>
        </div>
      </div> */}
      <div className="col-md-6 col-lg-3 reveal-up" style={{ "--d": ".15s" }}>
        <div className="pf-feature-card">
          <span className="pf-feature-icon"><i className="bi bi-arrow-repeat"></i></span>
          <h5>Subscriptions</h5>
          <p>Automate renewals, upgrades and cancellations with zero manual entry.</p>
        </div>
      </div>
      <div className="col-md-6 col-lg-3 reveal-up" style={{ "--d": ".05s" }}>
        <div className="pf-feature-card">
          <span className="pf-feature-icon"><i className="bi bi-clipboard2-pulse-fill"></i></span>
          <h5>Workout Plans</h5>
          <p>Build and assign custom training programs tailored to each member's goals.</p>
        </div>
      </div>
      <div className="col-md-6 col-lg-3 reveal-up" style={{ "--d": ".1s" }}>
        <div className="pf-feature-card">
          <span className="pf-feature-icon"><i className="bi bi-credit-card-2-front-fill"></i></span>
          <h5>Payments</h5>
          <p>Track invoices, dues and revenue with automated payment reminders.</p>
        </div>
      </div>
      <div className="col-md-6 col-lg-3 reveal-up" style={{ "--d": ".15s" }}>
        <div className="pf-feature-card">
          <span className="pf-feature-icon"><i className="bi bi-bar-chart-fill"></i></span>
          <h5>Reports</h5>
          <p>Actionable insights on growth, retention and revenue at a glance.</p>
        </div>
      </div>
      {/* <div className="col-md-6 col-lg-3 reveal-up" style={{ "--d": ".2s" }}>
        <div className="pf-feature-card">
          <span className="pf-feature-icon"><i className="bi bi-gear-fill"></i></span>
          <h5>Settings</h5>
          <p>Configure roles, branches, permissions and billing preferences with ease.</p>
        </div>
      </div> */}
    </div>
  </div>
</section>
    )
}
export default Features;