function Attendance () {
    return (
    //    <!-- ===== TIMELINE + ATTENDANCE ===== -->
<section id="members" className="pf-section pf-section-alt">
  <div className="container">
    <div className="row g-5">
      <div className="col-lg-6">
        <div className="pf-section-head reveal-up">
          <span className="pf-eyebrow">Activity</span>
          <h2>Member activity timeline</h2>
        </div>

        <div className="pf-timeline mt-4">
          <div className="pf-timeline-item reveal-left">
            <span className="pf-timeline-icon"><i className="bi bi-person-plus-fill"></i></span>
            <div>
              <h6 className="mb-1">Member Joined</h6>
              <p className="mb-0">Zainab Tariq signed up for the Premium plan.</p>
              <span className="pf-timeline-date">Jul 16, 9:12 AM</span>
            </div>
          </div>
          <div className="pf-timeline-item reveal-left" style={{ "--d": ".05s" }}>
            <span className="pf-timeline-icon"><i className="bi bi-arrow-repeat"></i></span>
            <div>
              <h6 className="mb-1">Subscription Renewed</h6>
              <p className="mb-0">Usman Farooq renewed the Standard plan for 3 months.</p>
              <span className="pf-timeline-date">Jul 16, 8:47 AM</span>
            </div>
          </div>
          <div className="pf-timeline-item reveal-left" style={{ "--d": ".1s" }}>
            <span className="pf-timeline-icon"><i className="bi bi-credit-card-fill"></i></span>
            <div>
              <h6 className="mb-1">Payment Received</h6>
              <p className="mb-0">$89 collected from Hina Raza via card.</p>
              <span className="pf-timeline-date">Jul 15, 6:30 PM</span>
            </div>
          </div>
          <div className="pf-timeline-item reveal-left" style={{ "--d": ".15s" }}>
            <span className="pf-timeline-icon"><i className="bi bi-clipboard2-check-fill"></i></span>
            <div>
              <h6 className="mb-1">Attendance Updated</h6>
              <p className="mb-0">Evening batch check-in completed for 41 members.</p>
              <span className="pf-timeline-date">Jul 15, 7:05 PM</span>
            </div>
          </div>
          <div className="pf-timeline-item reveal-left" style={{ "--d": ".2s" }}>
            <span className="pf-timeline-icon"><i className="bi bi-trophy-fill"></i></span>
            <div>
              <h6 className="mb-1">Workout Completed</h6>
              <p className="mb-0">Ali Raza finished the 8-week strength program.</p>
              <span className="pf-timeline-date">Jul 15, 5:20 PM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-6" id="attendance">
        <div className="pf-section-head reveal-up">
          <span className="pf-eyebrow">Attendance</span>
          <h2>Today's floor status</h2>
        </div>

        <div className="row g-3 mt-2">
          <div className="col-6 reveal-up">
            <div className="pf-attend-card">
              <div className="d-flex justify-content-between align-items-center">
                <span className="pf-mock-icon bg-accent-10"><i className="bi bi-check-circle"></i></span>
                <h4 className="mb-0">312</h4>
              </div>
              <p className="mb-1 mt-2">Present</p>
              <div className="progress pf-progress"><div className="progress-bar" data-width="88" style={{ width: "0%" }}></div></div>
            </div>
          </div>
          <div className="col-6 reveal-up" style={{ "--d": ".05s" }}>
            <div className="pf-attend-card">
              <div className="d-flex justify-content-between align-items-center">
                <span className="pf-mock-icon bg-accent-10"><i className="bi bi-x-circle"></i></span>
                <h4 className="mb-0">42</h4>
              </div>
              <p className="mb-1 mt-2">Absent</p>
              <div className="progress pf-progress"><div className="progress-bar" data-width="12" style={{ width: "0%" }}></div></div>
            </div>
          </div>
          <div className="col-6 reveal-up" style={{ "--d": ".1s" }}>
            <div className="pf-attend-card">
              <div className="d-flex justify-content-between align-items-center">
                <span className="pf-mock-icon bg-accent-10"><i className="bi bi-clock-history"></i></span>
                <h4 className="mb-0">27</h4>
              </div>
              <p className="mb-1 mt-2">Late</p>
              <div className="progress pf-progress"><div className="progress-bar" data-width="8" style={{ width: "0%" }}></div></div>
            </div>
          </div>
          <div className="col-6 reveal-up" style={{ "--d": ".15s" }}>
            <div className="pf-attend-card">
              <div className="d-flex justify-content-between align-items-center">
                <span className="pf-mock-icon bg-accent-10"><i className="bi bi-person-plus"></i></span>
                <h4 className="mb-0">16</h4>
              </div>
              <p className="mb-1 mt-2">New Members</p>
              <div className="progress pf-progress"><div className="progress-bar" data-width="35" style={{ width: "0%" }}></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    )
}
export default Attendance;