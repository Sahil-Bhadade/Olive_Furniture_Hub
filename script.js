/* =========================================================
   OLIVE FURNITURE HUB — SCRIPT
   1. Sticky header shrink on scroll
   2. Mobile nav toggle
   3. Smooth-scroll + auto-close mobile nav on link click
   4. Scroll-reveal (IntersectionObserver)
   5. Animated stat counter
   6. "View Details" -> jump to Customize + prefill furniture type
   7. Material swatch picker (wood / fabric)
   8. Enquiry form + Contact form (front-end only demo submit)
   9. Gallery lightbox
   10. Footer year
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Sticky header shrink ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 2. Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  /* ---------- 3. Close mobile nav after clicking a link ---------- */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 4. Scroll-reveal ---------- */
  const revealTargets = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- 5. Animated stat counter ---------- */
  const statEl = document.querySelector('.stat-number[data-count]');
  if (statEl) {
    const target = parseInt(statEl.getAttribute('data-count'), 10);
    let started = false;

    const runCount = () => {
      if (started) return;
      started = true;
      const duration = 1400;
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        statEl.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else statEl.classList.add('counted');
      };
      requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            runCount();
            statObserver.disconnect();
          }
        });
      }, { threshold: 0.5 });
      statObserver.observe(statEl);
    } else {
      runCount();
    }
  }

  /* ---------- 6. "View Details" -> Customize section ---------- */
  const furnitureSelect = document.getElementById('cf-type');
  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      if (furnitureSelect) {
        furnitureSelect.value = type;
      }
      document.getElementById('customize').scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- 7. Material swatch picker ---------- */
  const woodInput = document.getElementById('cf-wood');
  const fabricInput = document.getElementById('cf-fabric');
  const pickerSelection = document.getElementById('pickerSelection');

  function wireSwatchGroup(selector, hiddenInput, dataAttr) {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => { b.classList.remove('is-selected'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('is-selected');
        btn.setAttribute('aria-pressed', 'true');
        hiddenInput.value = btn.getAttribute(dataAttr);
        updateSelectionText();
      });
    });
  }

  function updateSelectionText() {
    if (pickerSelection) {
      pickerSelection.textContent = `Selected: ${woodInput.value} wood, ${fabricInput.value} fabric`;
    }
  }

  wireSwatchGroup('[data-wood]', woodInput, 'data-wood');
  wireSwatchGroup('[data-fabric]', fabricInput, 'data-fabric');

  /* ---------- 8. Forms (front-end only — wire to a backend / Formspree / EmailJS later) ---------- */
  function handleDemoSubmit(formEl, noteEl, successMsg) {
    formEl.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!formEl.checkValidity()) {
        formEl.reportValidity();
        noteEl.textContent = 'Please fill in all required fields correctly.';
        noteEl.classList.add('is-error');
        return;
      }

      noteEl.classList.remove('is-error');
      noteEl.textContent = successMsg;
      formEl.reset();

      // Reset swatch selections back to default after enquiry submit
      if (formEl.id === 'enquiryForm') {
        document.querySelectorAll('[data-wood]').forEach(b => b.classList.remove('is-selected'));
        document.querySelectorAll('[data-fabric]').forEach(b => b.classList.remove('is-selected'));
        document.querySelector('[data-wood="Teak"]').classList.add('is-selected');
        document.querySelector('[data-fabric="Olive Linen"]').classList.add('is-selected');
        woodInput.value = 'Teak';
        fabricInput.value = 'Olive Linen';
        updateSelectionText();
      }

      setTimeout(() => { noteEl.textContent = ''; }, 6000);
    });
  }

  const enquiryForm = document.getElementById('enquiryForm');
  const enquiryNote = document.getElementById('enquiryNote');
  if (enquiryForm) handleDemoSubmit(enquiryForm, enquiryNote, "Thanks! We've received your enquiry and will call you within 24 hours.");

  const contactForm = document.getElementById('contactForm');
  const contactNote = document.getElementById('contactNote');
  if (contactForm) handleDemoSubmit(contactForm, contactNote, "Message sent! We'll get back to you shortly.");

  /* ---------- 9. Gallery lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = item.getAttribute('data-caption') || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* ---------- 10. Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
