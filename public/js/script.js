// ===== ERROR SUPPRESSION FOR EXTENSIONS =====
window.addEventListener('error', function(e) {
    if (e.message && (e.message.includes('message channel closed') || e.message.includes('Extension')) ) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    }
});

window.addEventListener('unhandledrejection', function(e) {
    if (e.reason && e.reason.message && e.reason.message.includes('message channel closed')) {
        e.preventDefault();
        return false;
    }
});

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 2600);
});

// ===== MOUSE GLOW =====
const glow = document.getElementById('mouseGlow');
if (glow) {
  let glowX = 0, glowY = 0, currentX = 0, currentY = 0;
  document.addEventListener('mousemove', e => {
    glowX = e.clientX;
    glowY = e.clientY;
  });
  function animateGlow() {
    currentX += (glowX - currentX) * 0.08;
    currentY += (glowY - currentY) * 0.08;
    glow.style.left = currentX + 'px';
    glow.style.top = currentY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// ===== MOBILE MENU =====
const mobileBtn = document.getElementById('mobileBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
if (mobileBtn && mobileMenu && mobileClose) {
  mobileBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
}
function closeMobile() { 
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.remove('open'); 
}

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('active');
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      
      if (counter.dataset.animated === 'true') return;
      counter.dataset.animated = 'true';
      
      const target = +counter.getAttribute('data-target');
      const baseDuration = 1500;
      const duration = baseDuration + (target * 3);
      const start = performance.now();
      
      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        
        const currentVal = Math.floor(eased * target);
        
        // FIX: Snap to target when within 95% progress or 1 unit away
        if (progress >= 0.95 || currentVal >= target - 1) {
          counter.textContent = target;
          return;
        }
        
        counter.textContent = currentVal;
        
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      }
      
      requestAnimationFrame(update);
      counterObserver.unobserve(counter);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => {
  counterObserver.observe(counter);
});

// ===== TESTIMONIAL SLIDER =====
const track = document.getElementById('testiTrack');
const dots = document.querySelectorAll('.testi-dot');
const prevBtn = document.getElementById('testiPrev');
const nextBtn = document.getElementById('testiNext');
if (track && dots.length && prevBtn && nextBtn) {
  let testiIndex = 0;
  const totalTesti = dots.length;
  function goToTesti(i) {
    testiIndex = i;
    track.style.transform = `translateX(-${i * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
  }
  prevBtn.addEventListener('click', () => goToTesti(testiIndex <= 0 ? totalTesti - 1 : testiIndex - 1));
  nextBtn.addEventListener('click', () => goToTesti(testiIndex >= totalTesti - 1 ? 0 : testiIndex + 1));
  dots.forEach(d => d.addEventListener('click', () => goToTesti(+d.dataset.index)));
  setInterval(() => goToTesti(testiIndex >= totalTesti - 1 ? 0 : testiIndex + 1), 6000);
}

// Contact Form - Web3Forms AJAX Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const btn = this.querySelector('button[type="submit"]');
    const msg = document.getElementById('formMessage');
    
    btn.disabled = true;
    btn.textContent = 'Sending...';
    msg.className = 'form-message';
    msg.textContent = '';
    
    try {
      const res = await fetch(this.action, {
        method: 'POST',
        body: new FormData(this)
      });
      const data = await res.json();
      
      if (data.success) {
        msg.classList.add('success');
        msg.textContent = '✅ Thank you! We\'ll respond within 24 hours.';
        this.reset();
        setTimeout(() => msg.classList.remove('success'), 5000);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      msg.classList.add('error');
      msg.textContent = '❌ Error. Please try again or email us directly.';
      console.error('Form submission error:', err);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Inquiry';
    }
  });
}

// ===== GLOBAL VIDEO SECTION - NO CONTROLS, AUTOPLAY LOOP =====
const globalVideo = document.getElementById('globalVideo');

if (globalVideo) {
  // Remove any default controls
  globalVideo.controls = false;
  
  // Ensure video plays and loops properly
  globalVideo.addEventListener('loadeddata', function() {
    this.play().catch(e => console.log('Video autoplay prevented:', e));
  });
  
  // Keep looping if somehow it stops
  globalVideo.addEventListener('ended', function() {
    this.play().catch(e => console.log('Video replay error:', e));
  });
  
  // Add error handling with fallback
  globalVideo.addEventListener('error', function(e) {
    console.log('Video loading error:', e);
    const parent = this.parentElement;
    if (parent && !parent.querySelector('.video-fallback')) {
      const fallback = document.createElement('div');
      fallback.className = 'video-fallback';
      fallback.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--gold);">
          <span class="iconify" data-icon="mdi:map-outline" style="font-size:48px;margin-bottom:16px;"></span>
          <p style="font-size:14px;">Global export network</p>
          <p style="font-size:12px;color:rgba(232,228,222,0.5);margin-top:8px;">Middle East • Southeast Asia • North America • Europe</p>
        </div>
      `;
      parent.appendChild(fallback);
      this.style.display = 'none';
    }
  });
}

// Intersection observer to play/pause video when scrolling (saves bandwidth)
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && globalVideo && globalVideo.paused) {
      globalVideo.play().catch(e => console.log('Video play on view:', e));
    } else if (!entry.isIntersecting && globalVideo && !globalVideo.paused) {
      globalVideo.pause();
    }
  });
}, { threshold: 0.3 });

if (globalVideo) {
  videoObserver.observe(globalVideo);
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== PARALLAX ON HERO =====
const heroBg = document.querySelector('.hero-bg img');
window.addEventListener('scroll', () => {
  if (heroBg && window.scrollY < window.innerHeight) {
    heroBg.style.transform = `scale(1.1) translateY(${window.scrollY * 0.3}px)`;
  }
});

// ===== HIDE MOUSE GLOW ON MOBILE =====
if ('ontouchstart' in window && glow) {
  glow.style.display = 'none';
}

// ===== YEAR CHANGE ON FOOTER  =====
document.getElementById('autoYear').textContent = new Date().getFullYear();