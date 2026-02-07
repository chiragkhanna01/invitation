// ===============================
// Wedding Invitation - Main Script
// Features:
// 1. Countdown Timer
// 2. Smooth Scroll Navigation
// 3. Gallery Modal (Lightbox)
// 4. Intersection Observer Animations
// 5. Mobile Navigation Toggle
// ===============================

document.addEventListener("DOMContentLoaded", function () {
  // -------------------------------
  // 1. Countdown Timer
  // -------------------------------

  // Set wedding date (local time)
  const weddingDate = new Date("2026-02-20T00:00:00");

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function updateCountdown() {
    const now = new Date();
    const diff = weddingDate.getTime() - now.getTime();

    if (diff <= 0) {
      // Wedding date has passed or is happening now
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  // Initial call and update every second
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // -------------------------------
  // 2. Smooth Scroll Navigation
  // -------------------------------

  const navLinks = document.querySelectorAll(".nav-link, .hero-btn");

  function handleSmoothScroll(event) {
    const href = this.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    const targetEl = document.querySelector(href);
    if (!targetEl) return;

    event.preventDefault();

    const headerOffset = document.querySelector(".header")?.offsetHeight || 0;
    const rect = targetEl.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = rect.top + scrollTop - headerOffset + 6;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });

    // Close mobile nav after click (if open)
    closeMobileNav();
  }

  navLinks.forEach((link) => link.addEventListener("click", handleSmoothScroll));

  // -------------------------------
  // 3. Gallery Modal (Lightbox)
  // -------------------------------

  const galleryItems = document.querySelectorAll(".gallery-item img");
  const modal = document.getElementById("galleryModal");
  const modalImage = document.getElementById("modalImage");
  const modalCloseBtn = document.getElementById("modalClose");

  function openModal(src, alt) {
    if (!modal || !modalImage) return;
    modalImage.src = src;
    modalImage.alt = alt || "Gallery image";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (modalImage) {
      modalImage.src = "";
    }
  }

  galleryItems.forEach((img) => {
    img.addEventListener("click", function () {
      const fullSrc = this.getAttribute("data-full") || this.src;
      const alt = this.alt || "Gallery image";
      openModal(fullSrc, alt);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", function (event) {
      // Close when clicking outside the dialog
      if (event.target === modal || event.target.classList.contains("modal-backdrop")) {
        closeModal();
      }
    });

    // Close on Esc key
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });
  }

  // -------------------------------
  // 4. Intersection Observer Animations
  // -------------------------------

  const observedSections = document.querySelectorAll(".js-observe");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            // Animate once, then unobserve
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.18,
      }
    );

    observedSections.forEach((section) => observer.observe(section));
  } else {
    // Fallback: show all sections if IntersectionObserver is not supported
    observedSections.forEach((section) => section.classList.add("in-view"));
  }

  // Ensure hero is visible on load
  const heroSection = document.getElementById("hero");
  if (heroSection) {
    heroSection.classList.add("in-view");
  }

  // -------------------------------
  // 5. Mobile Navigation Toggle
  // -------------------------------

  const navToggle = document.querySelector(".nav-toggle");
  const navEl = document.querySelector(".nav");

  function openMobileNav() {
    if (!navToggle || !navEl) return;
    navToggle.classList.add("is-open");
    navEl.classList.add("is-open");
  }

  function closeMobileNav() {
    if (!navToggle || !navEl) return;
    navToggle.classList.remove("is-open");
    navEl.classList.remove("is-open");
  }

  if (navToggle && navEl) {
    navToggle.addEventListener("click", function () {
      const isOpen = navToggle.classList.contains("is-open");
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close nav when clicking outside (on mobile)
    document.addEventListener("click", function (event) {
      const target = event.target;
      const isClickInsideHeader =
        target.closest(".header-inner") || target.closest(".nav");
      const isSmallScreen = window.innerWidth < 768;

      if (isSmallScreen && !isClickInsideHeader && navToggle.classList.contains("is-open")) {
        closeMobileNav();
      }
    });

    // Reset nav state on resize
    window.addEventListener("resize", function () {
      const isSmallScreen = window.innerWidth < 768;
      if (!isSmallScreen) {
        // On desktop, ensure nav is always visible and toggle is reset
        navEl.classList.remove("is-open");
        navToggle.classList.remove("is-open");
      }
    });
  }

  // -------------------------------
  // 6. Footer Year
  // -------------------------------

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
});
