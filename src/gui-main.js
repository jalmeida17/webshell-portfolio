// ═══════════════════════════════════════════
// GUI Main — Dark Editorial Portfolio
// ═══════════════════════════════════════════

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle && navMenu) {
  mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = mobileMenuToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  // Close menu when clicking on a link
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const icon = mobileMenuToggle.querySelector('i');
      icon.className = 'fa-solid fa-bars';
    });
  });
}

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
}, { passive: true });

// Smooth scroll with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const navbarHeight = navbar.offsetHeight;
      const targetPosition = target.offsetTop - navbarHeight - 24;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Active nav link tracking
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  const navbarHeight = navbar.offsetHeight;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - navbarHeight - 100;
    if (window.pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}, { passive: true });

// Scroll reveal animations
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// Veille syntheses — expand/collapse detail on click
document.querySelectorAll('.veille-synth-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return; // don't toggle when clicking links
    card.classList.toggle('expanded');
  });
});

// Project cards — expand/collapse detail on button click
document.querySelectorAll('.project-expand-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.project-card').classList.toggle('expanded');
  });
});

// Project images — fetch manifest and inject galleries + lightbox
(async () => {
  try {
    const res = await fetch('/res/projects/manifest.json');
    const manifest = await res.json();

    // Create lightbox element using DOM methods
    const lightbox = document.createElement('div');
    lightbox.className = 'gui-lightbox';

    const lbClose = document.createElement('button');
    lbClose.className = 'gui-lightbox-close';
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fa-solid fa-xmark';
    lbClose.appendChild(closeIcon);

    const lbPrev = document.createElement('button');
    lbPrev.className = 'gui-lightbox-nav gui-lightbox-prev';
    const prevIcon = document.createElement('i');
    prevIcon.className = 'fa-solid fa-chevron-left';
    lbPrev.appendChild(prevIcon);

    const lbNext = document.createElement('button');
    lbNext.className = 'gui-lightbox-nav gui-lightbox-next';
    const nextIcon = document.createElement('i');
    nextIcon.className = 'fa-solid fa-chevron-right';
    lbNext.appendChild(nextIcon);

    const lbImg = document.createElement('img');
    lbImg.src = '';
    lbImg.alt = 'Project screenshot';

    lightbox.appendChild(lbClose);
    lightbox.appendChild(lbPrev);
    lightbox.appendChild(lbImg);
    lightbox.appendChild(lbNext);
    document.body.appendChild(lightbox);

    let lbSrcs = [];
    let lbIdx = 0;

    function openLightbox(srcs, idx) {
      lbSrcs = srcs;
      lbIdx = idx;
      lbImg.src = lbSrcs[lbIdx];
      lbPrev.style.display = lbSrcs.length > 1 ? '' : 'none';
      lbNext.style.display = lbSrcs.length > 1 ? '' : 'none';
      lightbox.classList.add('active');
    }
    function closeLightbox() { lightbox.classList.remove('active'); }
    function navLightbox(dir) {
      lbIdx = (lbIdx + dir + lbSrcs.length) % lbSrcs.length;
      lbImg.src = lbSrcs[lbIdx];
    }

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', () => navLightbox(-1));
    lbNext.addEventListener('click', () => navLightbox(1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navLightbox(-1);
      if (e.key === 'ArrowRight') navLightbox(1);
    });

    // Inject galleries into project cards
    document.querySelectorAll('.project-card[data-project]').forEach(card => {
      const projectId = card.dataset.project;
      const images = manifest[projectId];
      if (!images || images.length === 0) return;

      const srcs = images.map(f => `/res/projects/${projectId}/${f}`);
      const gallery = document.createElement('div');
      gallery.className = 'project-gallery';

      srcs.forEach((src, i) => {
        const img = document.createElement('img');
        img.className = 'project-gallery-thumb';
        img.src = src;
        img.alt = `${projectId} screenshot ${i + 1}`;
        img.addEventListener('click', () => openLightbox(srcs, i));
        gallery.appendChild(img);
      });

      // Insert gallery at the top of .project-detail
      const detail = card.querySelector('.project-detail');
      if (detail) detail.insertBefore(gallery, detail.firstChild);
    });
  } catch (e) {
    // Silently fail if manifest not available
  }
})();
