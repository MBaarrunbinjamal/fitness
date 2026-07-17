function Stats (){
   return(
    // <!-- ===== STATS ===== -->
<section className="pf-section pf-stats-section">
  <div className="container">
    <div className="row g-4">
      <div className="col-6 col-lg-3 reveal-up">
        <div className="pf-stat-card">
          <i className="bi bi-people-fill"></i>
          <h3><span data-count="2500">0</span>+</h3>
          <p>Members</p>
        </div>
      </div>
      <div className="col-6 col-lg-3 reveal-up" style={{ "--d": ".05s" }}>
        <div className="pf-stat-card">
          <i className="bi bi-cash-stack"></i>
          <h3>$<span data-count="125">0</span>K</h3>
          <p>Revenue</p>
        </div>
      </div>
      <div className="col-6 col-lg-3 reveal-up" style={{ "--d": ".1s" }}>
        <div className="pf-stat-card">
          <i className="bi bi-graph-up-arrow"></i>
          <h3><span data-count="96">0</span>%</h3>
          <p>Attendance</p>
        </div>
      </div>
      <div className="col-6 col-lg-3 reveal-up" style={{ "--d": ".15s" }}>
        <div className="pf-stat-card">
          <i className="bi bi-person-badge-fill"></i>
          <h3><span data-count="35">0</span></h3>
          <p>Trainers</p>
        </div>
      </div>
    </div>
  </div>
</section>
   )
}
export default Stats;