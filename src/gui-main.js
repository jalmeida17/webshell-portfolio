// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle && navMenu) {
  mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = mobileMenuToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
      icon.className = 'fa-solid fa-times';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  // Close menu when clicking on a link
  const navLinks = navMenu.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const icon = mobileMenuToggle.querySelector('i');
      icon.className = 'fa-solid fa-bars';
    });
  });
}

// Smooth scroll with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = target.offsetTop - navbarHeight - 20;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Add active state to nav links on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  const navbarHeight = document.querySelector('.navbar').offsetHeight;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - navbarHeight - 100;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.borderBottomColor = 'transparent';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.borderBottomColor = 'var(--primary-color)';
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.project-card, .skill-category, .contact-card, .career-card, .education-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Fetch and display news
async function fetchNews() {
  const newsContent = document.getElementById('news-content');
  if (!newsContent) return;

  const feeds = [
    { category: 'Development', icon: 'fa-solid fa-code', url: 'https://github.blog/feed/' },
    { category: 'Tech', icon: 'fa-solid fa-microchip', url: 'https://techcrunch.com/feed/' },
    { category: 'Science', icon: 'fa-solid fa-flask', url: 'https://www.sciencealert.com/rss' },
    { category: 'AI', icon: 'fa-solid fa-robot', url: 'https://venturebeat.com/feed/' },
    { category: 'Design', icon: 'fa-solid fa-palette', url: 'https://www.smashingmagazine.com/feed/' }
  ];

  try {
    let newsHTML = '';

    for (const feed of feeds) {
      try {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&api_key=lh7qwvgc9wlodqbp8ouslpcyxrml0ejeyursklsz&count=5`);
        const data = await response.json();

        if (data.status === 'ok' && data.items && data.items.length > 0) {
          newsHTML += `
            <div class="news-category">
              <h3 class="news-category-title">
                <i class="${feed.icon}"></i>
                ${feed.category}
              </h3>
          `;

          data.items.forEach(item => {
            const title = item.title.length > 80 ? item.title.substring(0, 80) + '...' : item.title;

            let description = '';
            if (item.description) {
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = item.description;
              const textContent = tempDiv.textContent || tempDiv.innerText || '';
              description = textContent.length > 120 ? textContent.substring(0, 120) + '...' : textContent;
            }

            newsHTML += `
              <div class="news-item">
                <div class="news-item-title">
                  <a href="${item.link}" target="_blank" rel="noopener noreferrer">${title}</a>
                </div>
                ${description ? `<p class="news-item-description">${description}</p>` : ''}
              </div>
            `;
          });

          newsHTML += `</div>`;
        } else {
          newsHTML += `
            <div class="news-category">
              <h3 class="news-category-title">
                <i class="${feed.icon}"></i>
                ${feed.category}
              </h3>
              <p style="color: #888;">Unable to fetch news from this source.</p>
            </div>
          `;
        }
      } catch (err) {
        newsHTML += `
          <div class="news-category">
            <h3 class="news-category-title">
              <i class="${feed.icon}"></i>
              ${feed.category}
            </h3>
            <p style="color: #888;">Failed to load news.</p>
          </div>
        `;
      }
    }

    newsContent.innerHTML = newsHTML;

    // Observe news categories for animation
    document.querySelectorAll('.news-category').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

  } catch (error) {
    newsContent.innerHTML = '<div class="news-error">Failed to fetch news feeds. Please try again later.</div>';
  }
}

// Load news when page loads
window.addEventListener('load', fetchNews);
