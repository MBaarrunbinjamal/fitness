function Footer(){

return(

<>
<footer class="site-footer">
  <div class="container">
    <div class="row g-5">
      <div class="col-lg-4">
        <a class="footer-brand" href="#hero">FORGE<span class="brand-dot">.</span></a>
        <p>Elite performance training for people who refuse average.</p>
        <div class="footer-socials">
          <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
          <a href="#" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>
          <a href="#" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
          <a href="#" aria-label="TikTok"><i class="bi bi-tiktok"></i></a>
        </div>
      </div>
      <div class="col-lg-2 col-6">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="#hero">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#programs">Programs</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>
      </div>
      <div class="col-lg-2 col-6">
        <h4>Company</h4>
        <ul>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Press</a></li>
        </ul>
      </div>
      <div class="col-lg-4">
        <h4>Stay Updated</h4>
        <p>Subscribe for training tips and member-only offers.</p>
        <form class="newsletter-form" id="newsletterForm">
          <input type="email" placeholder="Your email address" required aria-label="Email address for newsletter"/>
          <button type="submit" aria-label="Subscribe"><i class="bi bi-arrow-right"></i></button>
        </form>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© {new Date().getFullYear()} Forge Performance Club. All rights reserved.</p>
    </div>
  </div>
</footer> 



</>


);

}

export default Footer;