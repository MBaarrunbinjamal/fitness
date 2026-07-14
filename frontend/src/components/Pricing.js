function Pricing() {
  return (
    <section className="section pricing-section" id="pricing">
      <div className="container">

        <div className="section-head text-center reveal-up">
          <p className="eyebrow">Membership</p>

          <h2 className="section-title">
            Choose your <span className="text-accent">tier.</span>
          </h2>
        </div>

        <div className="row g-4 mt-4 align-items-center justify-content-center">

          {/* Basic */}

          <div className="col-lg-4 reveal-up d1">

            <div className="price-card">

              <p className="price-tier">
                Basic
              </p>

              <div className="price-value">
                <span>$29</span>/mo
              </div>

              <p className="price-desc">
                Everything you need to get started.
              </p>

              <ul className="price-list">

                <li><i className="bi bi-check2"></i> Full gym access</li>

                <li><i className="bi bi-check2"></i> Locker room</li>

                <li><i className="bi bi-check2"></i> Group classes (2/wk)</li>

                <li className="disabled">
                  <i className="bi bi-x"></i>
                  Personal training
                </li>

                <li className="disabled">
                  <i className="bi bi-x"></i>
                  Nutrition plan
                </li>

              </ul>

              <a href="#contact" className="btn btn-forge-ghost w-100">
                Get Started
              </a>

            </div>

          </div>

          {/* PRO */}

          <div className="col-lg-4 reveal-up d2">

            <div className="price-card price-featured">

              <span className="popular-badge">
                Most Popular
              </span>

              <p className="price-tier">
                Pro
              </p>

              <div className="price-value">
                <span>$59</span>/mo
              </div>

              <p className="price-desc">
                Serious training for serious results.
              </p>

              <ul className="price-list">

                <li><i className="bi bi-check2"></i> Full gym access 24/7</li>

                <li><i className="bi bi-check2"></i> Unlimited classes</li>

                <li><i className="bi bi-check2"></i> 2 personal sessions/mo</li>

                <li><i className="bi bi-check2"></i> Nutrition guidance</li>

                <li className="disabled">
                  <i className="bi bi-x"></i>
                  Elite trainer access
                </li>

              </ul>

              <a href="#contact" className="btn btn-forge-primary w-100">
                Get Started
              </a>

            </div>

          </div>

          {/* ELITE */}

          <div className="col-lg-4 reveal-up d3">

            <div className="price-card">

              <p className="price-tier">
                Elite
              </p>

              <div className="price-value">
                <span>$99</span>/mo
              </div>

              <p className="price-desc">
                The full Forge performance experience.
              </p>

              <ul className="price-list">

                <li><i className="bi bi-check2"></i> Full gym access 24/7</li>

                <li><i className="bi bi-check2"></i> Unlimited classes</li>

                <li><i className="bi bi-check2"></i> Weekly personal training</li>

                <li><i className="bi bi-check2"></i> Custom nutrition plan</li>

                <li><i className="bi bi-check2"></i> Elite trainer access</li>

              </ul>

              <a href="#contact" className="btn btn-forge-ghost w-100">
                Get Started
              </a>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Pricing;