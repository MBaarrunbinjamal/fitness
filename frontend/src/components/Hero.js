function Hero() {
  return (
    <header className="hero" id="hero">

      <div className="hero-bg">

        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1900&q=80"
          alt="Hero"
        />

        <div className="hero-overlay"></div>

        <div className="hero-grid-overlay"></div>

        <div className="blob blob-1"></div>

        <div className="blob blob-2"></div>

      </div>

      <div className="container hero-content">

        <div className="row align-items-center">

          <div className="col-lg-7">

            <p className="eyebrow reveal-up">

              FORGE PERFORMANCE CLUB — EST. 2014

            </p>

            <h1 className="hero-title">

              <span className="reveal-up d1">

                BUILD THE BODY

              </span>

              <span className="reveal-up d2 gradient-text">

                YOU DESERVE.

              </span>

            </h1>

            <span className="hero-underline reveal-scale d3"></span>

            <p className="hero-subtitle reveal-up d4">

              Elite coaching, cutting-edge equipment and a relentless community —

              engineered to turn effort into results, one rep at a time.

            </p>

            <div className="hero-cta reveal-up d5">

              <a
                href="#pricing"
                className="btn btn-forge-primary btn-lg magnetic"
              >

                <span>Start Training</span>

                <i className="bi bi-arrow-up-right"></i>

              </a>

              <a
                href="#programs"
                className="btn btn-forge-ghost btn-lg magnetic"
              >

                Explore Programs

              </a>

            </div>

          </div>

          <div className="col-lg-5 d-none d-lg-block">

            <div className="hero-float-card reveal-scale d3">

              <div className="hfc-top">

                <i className="bi bi-lightning-charge-fill"></i>

                <span>Live Session</span>

              </div>

              <p className="hfc-title">

                Strength & Conditioning

              </p>

              <div className="hfc-stats">

                <div>

                  <strong>240</strong>

                  <small>Calories/hr</small>

                </div>

                <div>

                  <strong>92%</strong>

                  <small>Intensity</small>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="scroll-indicator">

        <span>Scroll</span>

        <div className="mouse">

          <span></span>

        </div>

      </div>

    </header>
  );
}

export default Hero;