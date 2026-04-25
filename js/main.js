/* =============================================
   BBV – Main JavaScript
   ============================================= */

/**
 * Component Loader: Fetches and injects HTML into placeholders
 */
async function loadComponent(id, path) {
  const placeholder = document.getElementById(id);
  if (!placeholder) return;

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    const html = await response.text();
    placeholder.innerHTML = html;
    return true;
  } catch (err) {
    console.error('Error loading component:', err);
    return false;
  }
}

/**
 * Navigation & Header Logic: Encapsulated to run after header loads
 */
function initNavigation() {
  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (!header) return;

  // 1. Highlight active link
  const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/';
  let currentPath = normalizedPath.split('/').pop();
  // Normalize: empty or index.html becomes /
  if (currentPath === '' || currentPath === 'index.html') {
    currentPath = '/';
  } else {
    // Remove extension if present
    currentPath = currentPath.replace('.html', '');
  }

  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });

  // 2. Scroll-based background
  function updateHeader() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      if (!document.querySelector('.page-hero')) {
        header.classList.remove('scrolled');
      }
    }
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // 3. Mobile Nav Toggle
  function openMobileNav() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.contains('open') ? closeMobileNav() : openMobileNav();
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('open') && !mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
        closeMobileNav();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMobileNav();
        hamburger.focus();
      }
    });
  }
}

/**
 * YouTube Hero Background Player
 * Loads the IFrame API and creates a looping, muted, UI-free background video.
 */
function initHeroYTPlayer() {
  const playerContainer = document.getElementById('hero-yt-player');
  const soundToggle = document.getElementById('hero-sound-toggle');
  if (!playerContainer) return;

  // Inject the YouTube IFrame API script once (if not already injected)
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(tag, firstScript);
  }

  window.onYouTubeIframeAPIReady = function () {
    const player = new YT.Player('hero-yt-player', {
      videoId: 'X03siM4s22o',
      host: 'https://www.youtube-nocookie.com',
      playerVars: {
        autoplay: 1,
        mute: 1,
        loop: 1,
        playlist: 'X03siM4s22o', // required for loop to work
        controls: 0,
        disablekb: 1,
        fs: 0,
        rel: 0,
        modestbranding: 1,
        iv_load_policy: 3,
        showinfo: 0,
        playsinline: 1,
        enablejsapi: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: function (e) {
          e.target.playVideo();
          // Fade out the fallback background image once video starts
          const fallback = document.querySelector('.hero__bg--fallback');
          if (fallback) {
            fallback.style.opacity = '0';
          }

          // Sound Toggle Logic
          if (soundToggle) {
            const iconMuted = soundToggle.querySelector('.icon-muted');
            const iconUnmuted = soundToggle.querySelector('.icon-unmuted');

            soundToggle.addEventListener('click', () => {
              if (player.isMuted()) {
                player.unMute();
                iconMuted.style.display = 'none';
                iconUnmuted.style.display = 'block';
                soundToggle.setAttribute('aria-label', 'Mute background video');
                soundToggle.setAttribute('title', 'Mute sound');
              } else {
                player.mute();
                iconMuted.style.display = 'block';
                iconUnmuted.style.display = 'none';
                soundToggle.setAttribute('aria-label', 'Unmute background video');
                soundToggle.setAttribute('title', 'Unmute sound');
              }
            });
          }
        },
      },
    });
  };
}

/**
 * Residence card image sliders
 */
function initVillaSliders() {
  document.querySelectorAll('[data-villa-slider], [data-villa-carousel]').forEach(slider => {
    const image = slider.querySelector('img');
    const button = slider.querySelector('.villa-row__arrow');
    const carouselId = slider.dataset.villaCarousel;
    const configSlides = carouselId && window.BBV_VILLA_CAROUSELS ? window.BBV_VILLA_CAROUSELS[carouselId] : null;
    const inlineImages = (slider.dataset.sliderImages || '').split('|').filter(Boolean);
    const inlineAlts = (slider.dataset.sliderAlts || '').split('|');
    const slides = configSlides || inlineImages.map((src, index) => ({
      src,
      alt: inlineAlts[index] || inlineAlts[0] || '',
    }));

    if (!image || !button || slides.length < 2) return;

    let currentIndex = Math.max(0, slides.findIndex(slide => slide.src === image.getAttribute('src')));
    image.src = slides[currentIndex].src;
    image.alt = slides[currentIndex].alt || image.alt;

    button.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      image.src = slides[currentIndex].src;
      image.alt = slides[currentIndex].alt || image.alt;
    });
  });
}

/**
 * Initialize Everything
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Load global components
  const headerLoaded = await loadComponent('header-placeholder', 'components/header.html');
  const footerLoaded = await loadComponent('footer-placeholder', 'components/footer.html');

  if (headerLoaded) {
    initNavigation();
  }

  // Initialise YouTube background video (index.html only)
  initHeroYTPlayer();
  initVillaSliders();

  /* ─────────────────────────────────────────────
     SMOOTH SCROLL: In-page anchors
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const header = document.getElementById('site-header');
      const headerH = header ? header.offsetHeight : 0;
      const sidebar = document.querySelector('.info-sidebar');
      const sidebarH = (sidebar && window.innerWidth <= 768) ? sidebar.offsetHeight : 0;
      const offset = headerH + sidebarH + 8;

      const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ─────────────────────────────────────────────
     SIDEBAR NAV & VILLAS TABS (Existing logic)
  ───────────────────────────────────────────── */
  // ... rest of your specialized page logic (sidebar highlights, villa tabs, intersection observer)
  // (Keeping the logic shared below but initialized after content is ready)

  initializePageEffects();
});

function initializePageEffects() {
  // 1. Sidebar Highlight Logic
  const sidebarNav = document.querySelector('.info-sidebar__nav');
  const sidebarLinks = sidebarNav ? Array.from(sidebarNav.querySelectorAll('a')) : [];

  if (sidebarLinks.length > 0) {
    const sections = sidebarLinks.map(link => document.getElementById(link.getAttribute('href').replace('#', ''))).filter(Boolean);
    function highlight() {
      const scrollY = window.scrollY;
      const headerH = document.getElementById('site-header')?.offsetHeight || 0;
      const sidebarH = (sidebarNav && window.innerWidth <= 768) ? sidebarNav.parentElement.offsetHeight : 0;
      const offset = headerH + sidebarH + 32;

      let activeIndex = 0;
      sections.forEach((section, i) => { if (section.offsetTop - offset <= scrollY) activeIndex = i; });
      sidebarLinks.forEach((link, i) => {
        const isActive = i === activeIndex;
        link.classList.toggle('active', isActive);
        if (isActive && window.innerWidth <= 768) {
          sidebarNav.scrollTo({ left: link.offsetLeft - (sidebarNav.offsetWidth / 2) + (link.offsetWidth / 2), behavior: 'smooth' });
        }
      });
    }
    window.addEventListener('scroll', highlight, { passive: true });
    highlight();
  }

  // 2. Villa Tabs Logic
  const villasTabLinks = document.querySelectorAll('.villas-tabs__link');
  if (villasTabLinks.length > 0) {
    const villasSections = Array.from(villasTabLinks).map(link => document.getElementById(link.getAttribute('href').replace('#', ''))).filter(Boolean);
    const villasTabsBar = document.getElementById('villas-tabs');
    function highlightVillas() {
      const scrollY = window.scrollY;
      const headerH = document.getElementById('site-header')?.offsetHeight || 0;
      const offset = headerH + 64;
      let activeIndex = 0;
      villasSections.forEach((section, i) => { if (section.offsetTop - offset <= scrollY) activeIndex = i; });
      villasTabLinks.forEach((link, i) => {
        const isActive = i === activeIndex;
        link.classList.toggle('active', isActive);
        if (isActive && villasTabsBar && window.innerWidth <= 768) {
          villasTabsBar.querySelector('.villas-tabs__inner').scrollTo({ left: link.offsetLeft - (villasTabsBar.offsetWidth / 2) + (link.offsetWidth / 2), behavior: 'smooth' });
        }
      });
    }
    window.addEventListener('scroll', highlightVillas, { passive: true });
    highlightVillas();
  }

  // 3. Fade-in on scroll
  if ('IntersectionObserver' in window) {
    const fadeEls = document.querySelectorAll('.villa-row, .feature-strip__card, .info-section, .info-card, .contact-method');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    fadeEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(el);
    });
  }

  // 4. Experience Page Tabs (Curated Itineraries)
  const itineraryTabs = document.querySelector('.itinerary-tabs');
  if (itineraryTabs) {
    const tabBtns = itineraryTabs.querySelectorAll('.tab-btn');
    const tabPanels = itineraryTabs.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');

        // Update buttons
        tabBtns.forEach(b => b.classList.toggle('active', b === btn));

        // Update panels
        tabPanels.forEach(panel => {
          panel.classList.toggle('active', panel.id === target);
        });
      });
    });
  }
}
