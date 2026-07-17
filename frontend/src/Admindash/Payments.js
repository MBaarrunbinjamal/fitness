function Payments() {
  return (
    // <!-- ===== PAYMENTS ===== -->
<section id="payments" className="pf-section">
  <div className="container">
    <div className="pf-section-head text-center reveal-up">
      <span className="pf-eyebrow">Payment Overview</span>
      <h2>Track every transaction</h2>
      <p className="pf-section-sub">Stay on top of dues with real-time payment status across all members.</p>
    </div>

    <div className="glass-card pf-table-card mt-4 reveal-up">
      <div className="table-responsive">
        <table className="table pf-table align-middle mb-0">
          <thead>
            <tr>
              <th>Member</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><div className="d-flex align-items-center gap-2"><span className="pf-table-avatar">SA</span>Sara Ali</div></td>
              <td>Premium</td>
              <td>$79.00</td>
              <td><span className="badge pf-badge-paid">Paid</span></td>
              <td>Jul 14, 2026</td>
              <td className="text-end"><button className="pf-icon-btn sm" aria-label="View invoice"><i className="bi bi-three-dots"></i></button></td>
            </tr>
            <tr>
              <td><div className="d-flex align-items-center gap-2"><span className="pf-table-avatar">UF</span>Usman Farooq</div></td>
              <td>Standard</td>
              <td>$39.00</td>
              <td><span className="badge pf-badge-pending">Pending</span></td>
              <td>Jul 12, 2026</td>
              <td className="text-end"><button className="pf-icon-btn sm" aria-label="View invoice"><i className="bi bi-three-dots"></i></button></td>
            </tr>
            <tr>
              <td><div className="d-flex align-items-center gap-2"><span className="pf-table-avatar">HR</span>Hina Raza</div></td>
              <td>Basic</td>
              <td>$19.00</td>
              <td><span className="badge pf-badge-overdue">Overdue</span></td>
              <td>Jul 02, 2026</td>
              <td className="text-end"><button className="pf-icon-btn sm" aria-label="View invoice"><i className="bi bi-three-dots"></i></button></td>
            </tr>
            <tr>
              <td><div className="d-flex align-items-center gap-2"><span className="pf-table-avatar">AR</span>Ali Raza</div></td>
              <td>Premium</td>
              <td>$79.00</td>
              <td><span className="badge pf-badge-paid">Paid</span></td>
              <td>Jul 10, 2026</td>
              <td className="text-end"><button className="pf-icon-btn sm" aria-label="View invoice"><i className="bi bi-three-dots"></i></button></td>
            </tr>
            <tr>
              <td><div className="d-flex align-items-center gap-2"><span className="pf-table-avatar">ZT</span>Zainab Tariq</div></td>
              <td>Enterprise</td>
              <td>$249.00</td>
              <td><span className="badge pf-badge-paid">Paid</span></td>
              <td>Jul 09, 2026</td>
              <td className="text-end"><button className="pf-icon-btn sm" aria-label="View invoice"><i className="bi bi-three-dots"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>
  );
}
export default Payments;