function Membership() {
    return(
        // <!-- ===== MEMBERSHIP PLANS ===== -->
<section id="plans" className="pf-section pf-section-alt">
  <div className="container">
    <div className="pf-section-head text-center reveal-up">
      <span className="pf-eyebrow">Membership Plans</span>
      <h2>Pricing that scales with your gym</h2>
      <p className="pf-section-sub">Simple plans for solo studios up to multi-branch fitness chains.</p>
    </div>

    <div className="row g-4 mt-2 align-items-center">
      <div className="col-md-6 col-lg-3 reveal-up">
        <div className="pf-plan-card">
          <h6 className="pf-plan-name">Basic</h6>
          <div className="pf-plan-price">$19<span>/mo</span></div>
          <ul className="pf-plan-features">
            <li><i className="bi bi-check2"></i>Up to 100 members</li>
            <li><i className="bi bi-check2"></i>Attendance tracking</li>
            <li><i className="bi bi-check2"></i>Basic reports</li>
            <li><i className="bi bi-check2"></i>Email support</li>
          </ul>
          <a href="#" className="btn pf-btn-outline w-100">Join Plan</a>
        </div>
      </div>
      <div className="col-md-6 col-lg-3 reveal-up" style={{ "--d": ".05s" }}>
        <div className="pf-plan-card">
          <h6 className="pf-plan-name">Standard</h6>
          <div className="pf-plan-price">$39<span>/mo</span></div>
          <ul className="pf-plan-features">
            <li><i className="bi bi-check2"></i>Up to 500 members</li>
            <li><i className="bi bi-check2"></i>Trainer management</li>
            <li><i className="bi bi-check2"></i>Payment tracking</li>
            <li><i className="bi bi-check2"></i>Priority support</li>
          </ul>
          <a href="#" className="btn pf-btn-outline w-100">Join Plan</a>
        </div>
      </div>
      <div className="col-md-6 col-lg-3 reveal-up" style={{ "--d": ".1s" }}>
        <div className="pf-plan-card pf-plan-featured">
          <span className="pf-plan-tag">Most Popular</span>
          <h6 className="pf-plan-name">Premium</h6>
          <div className="pf-plan-price">$79<span>/mo</span></div>
          <ul className="pf-plan-features">
            <li><i className="bi bi-check2"></i>Unlimited members</li>
            <li><i className="bi bi-check2"></i>Full analytics suite</li>
            <li><i className="bi bi-check2"></i>Workout &amp; diet plans</li>
            <li><i className="bi bi-check2"></i>24/7 support</li>
          </ul>
          <a href="#" className="btn pf-btn-primary w-100">Join Plan</a>
        </div>
      </div>
      <div className="col-md-6 col-lg-3 reveal-up" style={{ "--d": ".15s" }}>
        <div className="pf-plan-card">
          <h6 className="pf-plan-name">Enterprise</h6>
          <div className="pf-plan-price">Custom</div>
          <ul className="pf-plan-features">
            <li><i className="bi bi-check2"></i>Multi-branch support</li>
            <li><i className="bi bi-check2"></i>Dedicated manager</li>
            <li><i className="bi bi-check2"></i>Custom integrations</li>
            <li><i className="bi bi-check2"></i>SLA guarantee</li>
          </ul>
          <a href="#" className="btn pf-btn-outline w-100">Contact Sales</a>
        </div>
      </div>
    </div>
  </div>
</section>
    )
}
export default Membership;