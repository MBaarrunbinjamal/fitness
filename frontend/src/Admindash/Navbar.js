
function Navbar() {
  return (
    // <!-- ===== NAVBAR ===== -->
<nav className="navbar navbar-expand-lg navbar-dark sticky-top pf-navbar" id="mainNav">
  <div className="container-fluid px-3 px-lg-4">
    <a className="navbar-brand pf-brand" href="#top">
      <span className="pf-logo-mark"><i className="bi bi-lightning-charge-fill"></i></span>
      PULSE<span className="text-accent">FORGE</span>
    </a>

    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain"
      aria-controls="navMain" aria-expanded="false" aria-label="Toggle navigation">
      <span className="pf-toggler-icon"><i className="bi bi-list"></i></span>
    </button>

    <div className="collapse navbar-collapse" id="navMain">
      <ul className="navbar-nav mx-auto pf-nav-links" id="navLinks">
        <li className="nav-item"><a className="nav-link active" href="#top">Dashboard</a></li>
        <li className="nav-item"><a className="nav-link" href="#members">Members</a></li>
        <li className="nav-item"><a className="nav-link" href="#trainers">Trainers</a></li>
        <li className="nav-item"><a className="nav-link" href="#plans">Plans</a></li>
        <li className="nav-item"><a className="nav-link" href="#attendance">Attendance</a></li>
        <li className="nav-item"><a className="nav-link" href="#payments">Payments</a></li>
        <li className="nav-item"><a className="nav-link" href="#reports">Reports</a></li>
      </ul>

      <div className="d-flex align-items-center gap-2 pf-nav-actions">
        <button className="pf-icon-btn" type="button" aria-label="Search" data-bs-toggle="tooltip" data-bs-title="Search">
          <i className="bi bi-search"></i>
        </button>
        <button className="pf-icon-btn position-relative" type="button" aria-label="Notifications" data-bs-toggle="tooltip" data-bs-title="Notifications">
          <i className="bi bi-bell"></i>
          <span className="pf-badge-dot">3</span>
        </button>

        <div className="dropdown">
          <button className="pf-admin-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <span className="pf-avatar">AK</span>
            <span className="d-none d-xl-inline">Amir Khan</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end pf-dropdown">
            <li><a className="dropdown-item" href="#"><i className="bi bi-person me-2"></i>My Profile</a></li>
            <li><a className="dropdown-item" href="#"><i className="bi bi-gear me-2"></i>Settings</a></li>
            <li><a className="dropdown-item" href="#"><i className="bi bi-question-circle me-2"></i>Help Center</a></li>
            <li><hr className="dropdown-divider"/></li>
            <li><a className="dropdown-item text-danger" href="#"><i className="bi bi-box-arrow-right me-2"></i>Sign Out</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</nav>
  );
}
export default Navbar;