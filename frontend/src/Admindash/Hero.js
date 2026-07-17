function Hero () {
    return (
        // <!-- ===== HERO ===== -->
<header id="top" className="pf-hero">
  <div className="pf-glow pf-glow-1"></div>
  <div className="pf-glow pf-glow-2"></div>
  <div className="container">
    <div className="row align-items-center gy-5">
      <div className="col-lg-6 reveal-up">
        <span className="pf-eyebrow"><i className="bi bi-stars me-1"></i> Built for modern gyms</span>
        <h1 className="pf-hero-title">Manage Your Gym <span className="text-accent">Smarter</span></h1>
        <p className="pf-hero-sub">Complete gym management dashboard to manage members, trainers, subscriptions, attendance, payments and analytics in one place.</p>

        <div className="d-flex flex-wrap gap-3 mt-4">
          <a href="#reports" className="btn pf-btn-primary btn-lg">
            Open Dashboard <i className="bi bi-arrow-right ms-1"></i>
          </a>
          <a href="#demo" className="btn pf-btn-outline btn-lg">
            <i className="bi bi-play-circle me-1"></i> View Demo
          </a>
        </div>

        <div className="pf-hero-checks row row-cols-2 g-2 mt-4">
          <div className="col"><i className="bi bi-check-circle-fill text-accent me-2"></i>Member Management</div>
          <div className="col"><i className="bi bi-check-circle-fill text-accent me-2"></i>Attendance Tracking</div>
          <div className="col"><i className="bi bi-check-circle-fill text-accent me-2"></i>Payment Reports</div>
          <div className="col"><i className="bi bi-check-circle-fill text-accent me-2"></i>Trainer Management</div>
        </div>
      </div>

      <div className="col-lg-6 reveal-left">
        <div className="pf-mock-card glass-card">
          <div className="pf-mock-head">
            <div>
              <p className="pf-mock-label mb-0">Overview</p>
              <h6 className="mb-0">Today, July 16</h6>
            </div>
            <span className="badge pf-badge-live"><i className="bi bi-circle-fill me-1"></i>Live</span>
          </div>

          <div className="row g-2 mt-1">
            <div className="col-6">
              <div className="pf-mock-stat">
                <span className="pf-mock-icon bg-accent-10"><i className="bi bi-currency-dollar"></i></span>
                <h4 className="mb-0" data-count="4820">0</h4>
                <p className="mb-0">Today's Revenue</p>
              </div>
            </div>
            <div className="col-6">
              <div className="pf-mock-stat">
                <span className="pf-mock-icon bg-accent-10"><i className="bi bi-people"></i></span>
                <h4 className="mb-0" data-count="2536">0</h4>
                <p className="mb-0">Active Members</p>
              </div>
            </div>
            <div className="col-6">
              <div className="pf-mock-stat">
                <span className="pf-mock-icon bg-accent-10"><i className="bi bi-calendar-check"></i></span>
                <h4 className="mb-0" data-count="96" data-suffix="%">0</h4>
                <p className="mb-0">Attendance</p>
              </div>
            </div>
            <div className="col-6">
              <div className="pf-mock-stat">
                <span className="pf-mock-icon bg-accent-10"><i className="bi bi-exclamation-circle"></i></span>
                <h4 className="mb-0" data-count="18">0</h4>
                <p className="mb-0">Pending Payments</p>
              </div>
            </div>
          </div>

          <div className="pf-mock-chart mt-3">
            <p className="pf-mock-label mb-2">Monthly Growth</p>
            <canvas id="heroChart" height="90"></canvas>
          </div>

          <div className="pf-mock-activity mt-3">
            <p className="pf-mock-label mb-2">Recent Activities</p>
            <div className="pf-activity-row"><i className="bi bi-person-plus text-accent"></i> New member — Sara Ali <span>2m</span></div>
            <div className="pf-activity-row"><i className="bi bi-credit-card text-accent"></i> Payment received — $89 <span>14m</span></div>
            <div className="pf-activity-row"><i className="bi bi-check2-circle text-accent"></i> Attendance marked — 41 members <span>1h</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</header>

    )
}
export default Hero