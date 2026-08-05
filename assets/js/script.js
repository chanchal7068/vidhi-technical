document.addEventListener("DOMContentLoaded", () => {
  /* ---------- footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- mobile nav ---------- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      burger.classList.toggle("active", isOpen);
    });
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- animated stat counters ---------- */
  const counters = document.querySelectorAll(".stat-num[data-count]");
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window && counters.length) {
    const countIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );
    counters.forEach((c) => countIO.observe(c));
  }

  /* ---------- header background on scroll ---------- */
  const header = document.getElementById("header");
  const hasVideoHero = document.querySelector(".hero-video") !== null;
  const isSubpage = header ? header.classList.contains("header-subpage") : false;
  
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
        if (isSubpage) {
          header.style.backgroundColor = "var(--paper)";
          header.style.borderBottomColor = "var(--line-soft)";
          header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.03)";
          // Set text colors to dark
          header.querySelectorAll(".nav a").forEach(a => a.style.color = "var(--charcoal-soft)");
          const cta = header.querySelector(".header-cta");
          if (cta) {
            cta.style.color = "var(--charcoal)";
            cta.style.borderColor = "var(--charcoal)";
          }
          header.querySelectorAll(".burger span").forEach(span => span.style.backgroundColor = "var(--charcoal)");
        } else if (hasVideoHero) {
          header.classList.remove("header-on-video");
        }
      } else {
        header.classList.remove("scrolled");
        if (isSubpage) {
          header.style.backgroundColor = "transparent";
          header.style.borderBottomColor = "transparent";
          header.style.boxShadow = "none";
          // Set text colors to light over the image banner
          header.querySelectorAll(".nav a").forEach(a => a.style.color = "var(--paper)");
          const cta = header.querySelector(".header-cta");
          if (cta) {
            cta.style.color = "var(--paper)";
            cta.style.borderColor = "rgba(247, 244, 236, 0.4)";
          }
          header.querySelectorAll(".burger span").forEach(span => span.style.backgroundColor = "var(--paper)");
        } else if (hasVideoHero) {
          header.classList.add("header-on-video");
        }
      }
    };
    onScroll(); // Run immediately on load
    document.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- contact form (front-end only) ---------- */
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (form && note) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      if (!name) {
        note.textContent = "Please add your name before sending.";
        note.style.color = "#a33";
        return;
      }
      note.style.color = "";
      note.textContent = `Thanks${name ? ", " + name.split(" ")[0] : ""} — we'll call you shortly on ${form.phone.value || "the number provided"}.`;
      form.reset();
    });
  }

  /* ---------- scroll to top button ---------- */
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    const handleScrollTopBtnVisibility = () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    };
    handleScrollTopBtnVisibility(); // Check immediately on load
    document.addEventListener("scroll", handleScrollTopBtnVisibility, { passive: true });

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  /* ---------- scroll-locked horizontal services track ---------- */
  const scrollTrack = document.querySelector(".services-scroll-track");
  const horizontalTrack = document.querySelector(".services-horizontal-track");
  const floatingHeader = document.querySelector(".services-floating-header");

  if (scrollTrack && horizontalTrack) {
    const handleServicesScroll = () => {
      if (window.innerWidth > 980) {
        const offsetTop = scrollTrack.offsetTop;
        const trackHeight = scrollTrack.offsetHeight;
        const viewHeight = window.innerHeight;
        const scrollDistance = trackHeight - viewHeight;

        let fraction = (window.scrollY - offsetTop) / scrollDistance;
        fraction = Math.max(0, Math.min(1, fraction));

        const translateX = -fraction * 66.6666;
        horizontalTrack.style.transform = `translateX(${translateX}%)`;

        // Hide floating header as soon as user scrolls into services section
        if (floatingHeader) {
          if (fraction > 0.01) {
            floatingHeader.classList.add("is-hidden");
          } else {
            floatingHeader.classList.remove("is-hidden");
          }
        }
      } else {
        horizontalTrack.style.transform = "none";
        if (floatingHeader) {
          floatingHeader.classList.remove("is-hidden");
        }
      }
    };

    window.addEventListener("scroll", handleServicesScroll, { passive: true });
    window.addEventListener("resize", handleServicesScroll);
    handleServicesScroll(); // Trigger once initially
  }
});
