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

// Fetch and display news using safe DOM construction
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
    // Clear loading state
    newsContent.textContent = '';

    for (const feed of feeds) {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'news-category reveal';

      const titleH3 = document.createElement('h3');
      titleH3.className = 'news-category-title';
      const titleIcon = document.createElement('i');
      titleIcon.className = feed.icon;
      titleH3.appendChild(titleIcon);
      titleH3.appendChild(document.createTextNode(' ' + feed.category));
      categoryDiv.appendChild(titleH3);

      try {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&api_key=lh7qwvgc9wlodqbp8ouslpcyxrml0ejeyursklsz&count=5`);
        const data = await response.json();

        if (data.status === 'ok' && data.items && data.items.length > 0) {
          data.items.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';

            const titleDiv = document.createElement('div');
            titleDiv.className = 'news-item-title';
            const titleLink = document.createElement('a');
            titleLink.href = item.link;
            titleLink.target = '_blank';
            titleLink.rel = 'noopener noreferrer';
            const title = item.title.length > 80 ? item.title.substring(0, 80) + '...' : item.title;
            titleLink.textContent = title;
            titleDiv.appendChild(titleLink);
            newsItem.appendChild(titleDiv);

            if (item.description) {
              const tempDiv = document.createElement('div');
              tempDiv.textContent = item.description.replace(/<[^>]*>/g, '');
              const textContent = tempDiv.textContent || '';
              const description = textContent.length > 120 ? textContent.substring(0, 120) + '...' : textContent;
              if (description) {
                const descP = document.createElement('p');
                descP.className = 'news-item-description';
                descP.textContent = description;
                newsItem.appendChild(descP);
              }
            }

            categoryDiv.appendChild(newsItem);
          });
        } else {
          const errorP = document.createElement('p');
          errorP.style.color = 'var(--clr-text-tertiary)';
          errorP.textContent = 'Unable to fetch news from this source.';
          categoryDiv.appendChild(errorP);
        }
      } catch (err) {
        const errorP = document.createElement('p');
        errorP.style.color = 'var(--clr-text-tertiary)';
        errorP.textContent = 'Failed to load news.';
        categoryDiv.appendChild(errorP);
      }

      newsContent.appendChild(categoryDiv);
      revealObserver.observe(categoryDiv);
    }

  } catch (error) {
    newsContent.textContent = '';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'news-error';
    errorDiv.textContent = 'Failed to fetch news feeds. Please try again later.';
    newsContent.appendChild(errorDiv);
  }
}

// Load news when page loads
window.addEventListener('load', fetchNews);
