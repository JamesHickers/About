// script.js — Wikipedia/Article Website Enhancer
// Designed for readability, stability, and great user experience.

// ====================================
// UTILITY FUNCTIONS
// ====================================

function debounce(func, wait = 150) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function throttle(func, limit = 100) {
  let lastFunc;
  let lastRan;
  return (...args) => {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

// ====================================
// SECTION ENTRY ANIMATION
// ====================================

function animateContentOnLoad() {
  const sections = document.querySelectorAll(".article-section, .content-block, .section");
  if (!sections.length) return;

  sections.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 200 + i * 100);
  });
}

// ====================================
// LAZY LOAD IMAGES
// ====================================

function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]");
  if (!images.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, observerSelf) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          observerSelf.unobserve(img);
        }
      });
    }, { rootMargin: "100px" });

    images.forEach(img => observer.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    });
  }
}

// ====================================
// TOC SCROLL SPY
// ====================================

function tocScrollSpy() {
  const tocLinks = document.querySelectorAll(".toc a[href^='#']");
  if (!tocLinks.length) return;

  const sections = Array.from(tocLinks)
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  function highlightLink() {
    let current = sections[0];
    sections.forEach(section => {
      if (window.scrollY + 100 >= section.offsetTop) {
        current = section;
      }
    });

    tocLinks.forEach(link => link.classList.remove("active"));
    const activeLink = document.querySelector(`.toc a[href="#${current.id}"]`);
    if (activeLink) activeLink.classList.add("active");
  }

  window.addEventListener("scroll", throttle(highlightLink, 100));
}

// ====================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ====================================

function enableSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;

    anchor.addEventListener("click", e => {
      e.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      history.pushState(null, null, anchor.getAttribute("href"));
    });
  });
}

// ====================================
// STICKY HEADER / TOC
// ====================================

function stickyHeaderOrToc() {
  const stickyEl = document.querySelector("header, .sticky-toc");
  if (!stickyEl) return;

  const stickyClass = "is-sticky";
  window.addEventListener("scroll", throttle(() => {
    if (window.scrollY > 100) {
      stickyEl.classList.add(stickyClass);
    } else {
      stickyEl.classList.remove(stickyClass);
    }
  }, 100));
}

// ====================================
// SCROLL POSITION RESTORATION
// ====================================

function preserveScrollPosition() {
  const key = "scroll-pos";
  window.addEventListener("beforeunload", () => {
    sessionStorage.setItem(key, window.scrollY);
  });
  const pos = sessionStorage.getItem(key);
  if (pos) {
    window.scrollTo(0, parseInt(pos));
    sessionStorage.removeItem(key);
  }
}

// ====================================
// RESPONSIVE EMBEDDED IFRAMES
// ====================================

function autoResizeIframes() {
  const iframes = document.querySelectorAll("iframe");
  if (!iframes.length) return;

  window.addEventListener("message", (event) => {
    if (
      event.origin.includes("carrd.co") &&
      event.data &&
      typeof event.data.height === "number" &&
      event.source
    ) {
      iframes.forEach((iframe) => {
        if (iframe.contentWindow === event.source) {
          iframe.style.height = `${event.data.height}px`;
        }
      });
    }
  });
}

// ====================================
// OPTIONAL: READING PROGRESS BAR
// ====================================

function readingProgress() {
  const progressBar = document.querySelector(".progress-bar");
  if (!progressBar) return;

  window.addEventListener("scroll", throttle(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
  }, 50));
}
function toggleVisibility(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('visible-section');
}
// ====================================
// INITIALIZE EVERYTHING ON DOM LOAD
// ====================================

document.addEventListener("DOMContentLoaded", () => {
  animateContentOnLoad();
  lazyLoadImages();
  tocScrollSpy();
  enableSmoothScrolling();
  stickyHeaderOrToc();
  preserveScrollPosition();
  autoResizeIframes();
  readingProgress();
  toggleVisiblity();
});
