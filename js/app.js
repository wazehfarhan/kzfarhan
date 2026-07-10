(function () {
  const smoothWrapper = document.getElementById("smooth-wrapper");
  const cursorDot = document.getElementById("cursor-dot");
  const cursorRing = document.getElementById("cursor-ring");
  const preloader = document.getElementById("preloader");
  const preloaderCounter = document.getElementById("preloader-counter");

  const allRevealEls = document.querySelectorAll("[data-reveal]");
  const allStaggerContainers = document.querySelectorAll(
    "[data-reveal-stagger]",
  );
  const allHoverTargets = document.querySelectorAll(
    "a, button, .project-card, [data-magnetic], .nav-links a, .contact-link",
  );
  const allScrollLinks = document.querySelectorAll("[data-scroll-to]");
  const projectCards = document.querySelectorAll(".project-card");
  const projectList = document.querySelector(".projects-list");

  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  let currentScroll = 0;
  let targetScroll = 0;
  let maxScroll = 0;
  let scrollEase = 0.08;
  let rafId = null;
  let isPreloaderDone = false;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let ringEase = 0.12;
  let cursorVisible = true;
  let cursorHoverState = "default";

  function runPreloader() {
    const duration = 1200;
    const startTime = performance.now();
    let prevCount = -1;

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const newCount = Math.round(easedProgress * 100);

      // update only when value changes — trigger a short pulse for dynamics
      if (newCount !== prevCount) {
        preloaderCounter.textContent = newCount;
        preloaderCounter.classList.add("pulse");
        // occasionally trigger a shimmer for a nicer effect near the end
        if (progress > 0.6) preloaderCounter.classList.add("shimmer");
        setTimeout(() => {
          preloaderCounter.classList.remove("pulse");
        }, 160);
        prevCount = newCount;
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        // finish with a little extra sheen, then hide the preloader
        preloaderCounter.classList.add("pulse");
        setTimeout(() => preloaderCounter.classList.add("shimmer"), 80);
        setTimeout(() => {
          preloader.classList.add("loaded");
          isPreloaderDone = true;
          recalcMaxScroll();
          targetScroll = currentScroll;
          rafId = requestAnimationFrame(smoothScrollLoop);
          checkAllReveals();
        }, 400);
      }
    }

    requestAnimationFrame(tick);
  }

  function recalcMaxScroll() {
    maxScroll = Math.max(0, smoothWrapper.scrollHeight - window.innerHeight);
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
    currentScroll = Math.max(0, Math.min(currentScroll, maxScroll));
  }

  function smoothScrollLoop() {
    if (!isPreloaderDone) {
      rafId = requestAnimationFrame(smoothScrollLoop);
      return;
    }

    const diff = targetScroll - currentScroll;
    if (Math.abs(diff) < 0.05) currentScroll = targetScroll;
    else currentScroll += diff * scrollEase;

    smoothWrapper.style.transform = `translateY(${-currentScroll}px)`;
    checkAllReveals();
    updateCursorRing();

    rafId = requestAnimationFrame(smoothScrollLoop);
  }

  function onWheel(e) {
    if (!isPreloaderDone) return;
    e.preventDefault();
    const delta = e.deltaY;
    targetScroll += delta * 1.2;
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
  }

  function setupTouchFallback() {
    if (isTouchDevice) {
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
      document.body.style.height = "auto";
      smoothWrapper.style.transform = "none";
      smoothWrapper.style.willChange = "auto";

      if (rafId) cancelAnimationFrame(rafId);

      document
        .querySelectorAll("[data-reveal]")
        .forEach((el) => el.classList.add("revealed"));
      document
        .querySelectorAll("[data-reveal-stagger]")
        .forEach((el) => el.classList.add("revealed"));
    }
  }

  function checkAllReveals() {
    const vh = window.innerHeight;
    const offset = vh * 0.15;

    allRevealEls.forEach((el) => {
      if (el.classList.contains("revealed")) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < vh - offset && rect.bottom > 0)
        el.classList.add("revealed");
      // If this revealed block contains stat counters, animate them once
      if (el.classList.contains("revealed") && el.querySelectorAll) {
        const counters = el.querySelectorAll(".stat-counter");
        if (counters && counters.length) animateCounters(counters);
        // Animate skill bars when skills block is revealed
        const skillBars =
          el.querySelectorAll && el.querySelectorAll(".skill-bar");
        if (skillBars && skillBars.length) animateSkillBars(skillBars);
      }
    });

    allStaggerContainers.forEach((container) => {
      if (container.classList.contains("revealed")) return;
      const rect = container.getBoundingClientRect();
      if (rect.top < vh - offset && rect.bottom > 0)
        container.classList.add("revealed");
    });

    updateActiveProjectOnScroll();
  }

  // Animate numeric counters (accepts NodeList or array)
  function animateCounters(list) {
    list = Array.from(list);
    list.forEach((el) => {
      // skip if already animated
      if (el.dataset.animated === "true") return;
      const target = parseInt(el.getAttribute("data-target") || "0", 10);
      const duration = 1200;
      const start = performance.now();
      el.dataset.animated = "true";

      function step(now) {
        const t = Math.min((now - start) / duration, 1);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3);
        const value = Math.floor(eased * target);
        el.textContent = value;

        // pop briefly when value increases
        el.classList.add("pop");
        setTimeout(() => el.classList.remove("pop"), 160);

        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target; // ensure exact final value
      }

      requestAnimationFrame(step);
    });
  }

  // Populate hero stat counters from DOM (projects, years, skills)
  function populateHeroStats() {
    const counters = document.querySelectorAll(".stat-counter");
    if (!counters || counters.length === 0) return;

    const projectsCount =
      document.querySelectorAll(".project-card").length || 0;
    const skillsCount = document.querySelectorAll(".about-tag").length || 0;

    // derive years from the earliest 4-digit year found in .education-year
    const yearEls = document.querySelectorAll(".education-year");
    const yearsFound = [];
    yearEls.forEach((el) => {
      const txt = (el.textContent || "").trim();
      const m = txt.match(/(19|20)\d{2}/g);
      if (m) yearsFound.push(...m.map((y) => parseInt(y, 10)));
    });
    const currentYear = new Date().getFullYear();
    let years = 1;
    if (yearsFound.length) {
      const startYear = Math.min(...yearsFound);
      years = Math.max(1, currentYear - startYear);
    }

    counters.forEach((el) => {
      const label = (
        (el.closest &&
          el.closest(".stat-item")?.querySelector(".stat-label")
            ?.textContent) ||
        ""
      ).toLowerCase();

      if (label.includes("project"))
        el.setAttribute("data-target", projectsCount);
      else if (label.includes("year")) el.setAttribute("data-target", years);
      else if (label.includes("skill"))
        el.setAttribute("data-target", skillsCount);

      // ensure counters start from zero and are ready to animate
      el.textContent = "0";
      delete el.dataset.animated;
    });
  }

  // expose a refresh helper for extra project loads
  window.refreshHeroStats = populateHeroStats;

  // Animate skill bars (NodeList or array of .skill-bar elements)
  function animateSkillBars(list) {
    list = Array.from(list);
    list.forEach((el) => {
      if (el.dataset.animated === "true") return;
      const pct = Math.min(
        100,
        Math.max(0, parseInt(el.getAttribute("data-percent") || "0", 10)),
      );
      el.dataset.animated = "true";
      // set width to trigger CSS transition
      requestAnimationFrame(() => {
        el.style.width = pct + "%";
        // also update visible percent text if available
        const head =
          el.closest && el.closest(".skill")?.querySelector(".skill-percent");
        if (head) head.textContent = pct + "%";
      });
    });
  }

  function updateCursorRing() {
    ringX += (mouseX - ringX) * ringEase;
    ringY += (mouseY - ringY) * ringEase;

    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";

    cursorRing.style.left = ringX + "px";
    cursorRing.style.top = ringY + "px";
  }

  function setCursorState(state) {
    if (cursorHoverState === state) return;
    cursorHoverState = state;

    cursorDot.classList.remove("hover-link", "hover-hidden");
    cursorRing.classList.remove("hover-link", "hover-hidden");

    if (state === "link") {
      cursorDot.classList.add("hover-link");
      cursorRing.classList.add("hover-link");
    } else if (state === "hidden") {
      cursorDot.classList.add("hover-hidden");
      cursorRing.classList.add("hover-hidden");
    }
  }

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!cursorVisible) {
      cursorVisible = true;
      cursorDot.style.opacity = "1";
      cursorRing.style.opacity = "1";
    }
  }

  function onMouseLeave() {
    cursorVisible = false;
    cursorDot.style.opacity = "0";
    cursorRing.style.opacity = "0";
  }

  function onMouseEnter() {
    cursorVisible = true;
    cursorDot.style.opacity = "1";
    cursorRing.style.opacity = "1";
  }

  function setupMagneticElements() {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        el.style.transition = "transform 0.15s ease-out";
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0,0)";
        el.style.transition = "transform 0.5s cubic-bezier(0.19,1,0.22,1)";
      });
    });
  }

  function scrollToSection(targetId) {
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    let offsetTop = 0;
    let el = targetEl;
    while (el && el !== smoothWrapper) {
      offsetTop += el.offsetTop;
      el = el.offsetParent;
    }

    targetScroll = Math.max(0, Math.min(offsetTop - 80, maxScroll));

    const originalEase = scrollEase;
    scrollEase = 0.15;
    setTimeout(() => {
      scrollEase = originalEase;
    }, 600);
  }

  function setupScrollLinks() {
    allScrollLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("data-scroll-to");

        if (targetId && isPreloaderDone && !isTouchDevice) {
          scrollToSection(targetId);
        } else if (targetId) {
          document
            .getElementById(targetId)
            ?.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  function updateActiveProjectOnScroll() {
    if (!projectList || projectCards.length === 0) return;

    const listRect = projectList.getBoundingClientRect();
    const midpoint = window.innerHeight / 2;

    let nearestCard = null;
    let nearestDistance = Infinity;

    projectCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distance = Math.abs(cardCenter - midpoint);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestCard = card;
      }
    });

    projectCards.forEach((card) => {
      if (card === nearestCard) {
        card.classList.add("active-project");
      } else {
        card.classList.remove("active-project");
      }
    });
  }

  function setupProjectPreviewHover() {
    document.querySelectorAll(".project-card").forEach((card) => {
      const mainImage = card.querySelector(".project-preview-main-img");
      const thumbItems = card.querySelectorAll(".project-preview-thumb");
      if (!mainImage || thumbItems.length === 0) return;

      thumbItems.forEach((thumb) => {
        const imageSrc = thumb.dataset.image;
        const imageAlt =
          thumb.dataset.alt || thumb.querySelector("img")?.alt || "";
        if (!imageSrc) return;

        thumb.addEventListener("mouseenter", () => {
          thumbItems.forEach((item) => item.classList.remove("active"));
          thumb.classList.add("active");

          if (mainImage.getAttribute("src") === imageSrc) return;
          mainImage.style.opacity = "0";
          mainImage.onload = () => {
            mainImage.style.opacity = "1";
          };
          mainImage.src = imageSrc;
          mainImage.alt = imageAlt;
        });
      });
    });
  }

  function bindEvents() {
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    allHoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", () => setCursorState("link"));
      el.addEventListener("mouseleave", () => setCursorState("default"));
    });

    document.addEventListener("mouseout", (e) => {
      if (!e.relatedTarget) setCursorState("hidden");
    });

    window.addEventListener("resize", () => {
      recalcMaxScroll();
      if (!isTouchDevice && isPreloaderDone) {
        smoothWrapper.style.transform = `translateY(${-currentScroll}px)`;
      }
      checkAllReveals();
    });

    window.addEventListener("keydown", (e) => {
      if (!isPreloaderDone || isTouchDevice) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        targetScroll = Math.min(targetScroll + 80, maxScroll);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        targetScroll = Math.max(targetScroll - 80, 0);
      } else if (e.key === "Home") {
        e.preventDefault();
        targetScroll = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        targetScroll = maxScroll;
      }
    });

    setupScrollLinks();
    setupMagneticElements();
    setupTouchFallback();
  }

  function init() {
    bindEvents();
    setupProjectPreviewHover();

    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
    ringX = mouseX;
    ringY = mouseY;

    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";
    cursorRing.style.left = ringX + "px";
    cursorRing.style.top = ringY + "px";

    // populate dynamic values (hero counters) before preloader finishes
    populateHeroStats();

    recalcMaxScroll();
    runPreloader();

    if (isTouchDevice) {
      document
        .querySelectorAll("[data-reveal]")
        .forEach((el) => el.classList.add("revealed"));
      document
        .querySelectorAll("[data-reveal-stagger]")
        .forEach((el) => el.classList.add("revealed"));
    }
  }

  init();

  console.log(
    "%c🚀 Portfolio Ready %c| %cKazi Md. Wazeh Ullah Farhan",
    "color:#d4a853;font-weight:bold;",
    "",
    "color:#e8e4df;",
  );
  console.log(
    "%c📧 wzullah.farhan@gmail.com %c| %c🔗 github.com/wazehfarhan",
    "color:#e8e4df;",
    "",
    "color:#8a8580;",
  );
  console.log(
    "%c👆 Update LinkedIn URL and any other links as needed.",
    "color:#8a8580;",
  );
})();
