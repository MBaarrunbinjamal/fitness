function FAQ() {
  return (
    // <!-- ============ FAQ ============ -->
<section class="section faq-section">
  <div class="container">
    <div class="row g-5">
      <div class="col-lg-4">
        <p class="eyebrow reveal-up">Questions</p>
        <h2 class="section-title reveal-up">Frequently <span class="text-accent">asked.</span></h2>
        <p class="section-desc reveal-up">Can't find the answer you're looking for? Reach out to our team directly.</p>
        {/* <a href="#contact" class="btn btn-forge-ghost reveal-up">Contact Us</a> */}
      </div>
      <div class="col-lg-8 reveal-up">
        <div class="accordion forge-accordion" id="faqAccordion">
          <div class="accordion-item">
            <h3 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                Do I need a membership to try a class?
              </button>
            </h3>
            <div id="faq1" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div class="accordion-body">No — book a free trial class before committing to any plan. Just bring workout clothes and water.</div>
            </div>
          </div>
          <div class="accordion-item">
            <h3 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                Can I freeze or cancel my membership?
              </button>
            </h3>
            <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div class="accordion-body">Yes, all memberships can be frozen for up to 60 days per year and cancelled with 30 days' notice.</div>
            </div>
          </div>
          <div class="accordion-item">
            <h3 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                Are personal trainers included?
              </button>
            </h3>
            <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div class="accordion-body">Pro and Elite plans include personal training sessions each month. Basic members can book sessions separately.</div>
            </div>
          </div>
          <div class="accordion-item">
            <h3 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                What are your opening hours?
              </button>
            </h3>
            <div id="faq4" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div class="accordion-body">Pro and Elite members get 24/7 keycard access. Basic members can train 5am–11pm daily.</div>
            </div>
          </div>
          <div class="accordion-item">
            <h3 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq5">
                Do you offer nutrition coaching?
              </button>
            </h3>
            <div id="faq5" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div class="accordion-body">Yes, our in-house nutrition coaches build custom meal strategies included in Pro and Elite tiers.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

       );
    }
export default FAQ;
