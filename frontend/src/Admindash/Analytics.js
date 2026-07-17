function Analytics (){
    return(
        // <!-- ===== ANALYTICS PREVIEW ===== -->
<section id="reports" className="pf-section">
  <div className="container">
    <div className="pf-section-head text-center reveal-up">
      <span className="pf-eyebrow">Analytics</span>
      <h2>See growth before it happens</h2>
      <p className="pf-section-sub">Revenue, attendance and retention trends updated as the day moves.</p>
    </div>

    <div className="row g-4 mt-2 align-items-stretch">
      <div className="col-lg-8 reveal-up">
        <div className="glass-card pf-analytics-main h-100">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
            <div>
              <h5 className="mb-0">Revenue &amp; Membership Growth</h5>
              <p className="pf-mock-label mb-0">Last 7 months</p>
            </div>
            <div className="pf-chip-group">
              <button className="pf-chip active" data-range="7">7M</button>
              <button className="pf-chip" data-range="12">12M</button>
            </div>
          </div>
          <canvas id="mainChart" height="130"></canvas>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="row g-4">
          <div className="col-6 col-lg-12 reveal-right">
            <div className="pf-side-card">
              <span className="pf-mock-icon bg-accent-10"><i className="bi bi-cash-coin"></i></span>
              <div>
                <h5 className="mb-0">$4,820</h5>
                <p className="mb-0">Today's Revenue</p>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-12 reveal-right" style={{ "--d": ".05s" }}>
            <div className="pf-side-card">
              <span className="pf-mock-icon bg-accent-10"><i className="bi bi-wallet2"></i></span>
              <div>
                <h5 className="mb-0">$62,400</h5>
                <p className="mb-0">Monthly Income</p>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-12 reveal-right" style={{ "--d": ".1s" }}>
            <div className="pf-side-card">
              <span className="pf-mock-icon bg-accent-10"><i className="bi bi-hourglass-split"></i></span>
              <div>
                <h5 className="mb-0">18 Members</h5>
                <p className="mb-0">Pending Payments</p>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-12 reveal-right" style={{ "--d": ".15s" }}>
            <div className="pf-side-card">
              <span className="pf-mock-icon bg-accent-10"><i className="bi bi-graph-up"></i></span>
              <div>
                <h5 className="mb-0 text-accent">+12.4%</h5>
                <p className="mb-0">Monthly Growth</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    )
}
export default Analytics;