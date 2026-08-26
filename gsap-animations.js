(function () {
  const hasGsap = window.gsap && window.ScrollTrigger;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!hasGsap || reduceMotion) {
    document.documentElement.classList.add("gsap-ready");
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out", duration: 0.8 });

  const style = document.createElement("style");
  style.textContent = `
    html, body { overflow-x: clip; }
    .gsap-word { display: inline-block; will-change: transform, opacity; }
    .section-band::after { transform: translate3d(0, var(--bandShift, 0), 0); will-change: transform; }
    .hero-visual, .hero-visual img, .proof-panel, .button, .carousel-button, .contact-link,
    .program-card, .strip-grid > div, .mini-grid article, .score-row, .cases-grid figure, .review-zoom {
      will-change: transform;
    }
  `;
  document.head.append(style);

  document.documentElement.classList.add("gsap-ready");

  const select = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const exists = (selector) => document.querySelector(selector);
  const formatNumber = (value) => Math.round(value).toLocaleString("ru-RU").replace(/\u00a0/g, " ");

  const splitWords = (element) => {
    if (!element || element.dataset.gsapSplit) return [];

    const words = element.textContent.trim().split(/\s+/);
    element.dataset.gsapSplit = "true";
    element.textContent = "";

    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.className = "gsap-word";
      span.textContent = word;
      element.append(span);
      if (index < words.length - 1) element.append(" ");
    });

    return select(".gsap-word", element);
  };

  const heroWords = splitWords(document.querySelector(".hero h1"));

  gsap.set([
    ".section-heading",
    ".strip-grid > div",
    ".program-card",
    ".material-slide",
    ".score-row",
    ".mini-grid article",
    ".about-photo",
    ".about-copy",
    ".education-carousel",
    ".cases-grid figure",
    ".review-slide",
    ".contacts-grid > *"
  ].join(","), { autoAlpha: 0, willChange: "transform, opacity" });

  const heroTimeline = gsap.timeline({
    defaults: { duration: 0.9, ease: "power3.out" }
  });

  heroTimeline
    .from(".site-header", { autoAlpha: 0, y: -28, scale: 0.985, duration: 0.72 })
    .from(".hero .eyebrow", { autoAlpha: 0, y: 16, letterSpacing: "0.08em" }, "-=0.22")
    .from(heroWords.length ? heroWords : ".hero h1", {
      autoAlpha: 0,
      yPercent: 105,
      rotationX: -32,
      transformOrigin: "50% 100%",
      stagger: { each: 0.026, from: "start" },
      duration: 0.78
    }, "-=0.42")
    .from(".hero .lead", { autoAlpha: 0, y: 24, clipPath: "inset(0 0 100% 0)" }, "-=0.35")
    .from(".hero-actions .button", {
      autoAlpha: 0,
      y: 22,
      scale: 0.94,
      stagger: 0.1,
      ease: "back.out(1.5)"
    }, "-=0.36")
    .from(".hero-visual img", {
      autoAlpha: 0,
      y: 46,
      scale: 0.94,
      rotation: 1.8,
      clipPath: "inset(10% 8% 10% 8% round 16px)",
      duration: 1.05
    }, "-=1.05")
    .from(".proof-panel", {
      autoAlpha: 0,
      x: 28,
      y: 18,
      scale: 0.9,
      ease: "back.out(1.6)"
    }, "-=0.44")
    .from(".metrics > div", {
      autoAlpha: 0,
      y: (index) => 26 + index * 8,
      x: (index) => (index - 1) * 18,
      rotation: (index) => (index - 1) * 1.8,
      scale: 0.94,
      stagger: 0.1
    }, "-=0.42");

  select(".section-heading").forEach((heading, index) => {
    gsap.fromTo(heading, {
      autoAlpha: 0,
      y: 42,
      clipPath: "inset(0 0 18% 0)"
    }, {
      autoAlpha: 1,
      y: 0,
      clipPath: "inset(0 0 0% 0)",
      duration: 0.82,
      ease: "power3.out",
      clearProps: "willChange,clipPath",
      scrollTrigger: {
        trigger: heading,
        start: "top 84%",
        once: true,
        refreshPriority: index
      }
    });
  });

  const revealGroup = (selector, options = {}) => {
    select(selector).forEach((group, index) => {
      const children = select(options.children || ":scope > *", group);
      const targets = children.length ? children : [group];
      const direction = index % 2 === 0 ? 1 : -1;

      gsap.fromTo(targets, {
        autoAlpha: 0,
        x: options.x ?? ((itemIndex) => direction * (itemIndex % 2 ? 22 : -22)),
        y: options.y ?? ((itemIndex) => 42 + itemIndex * 4),
        rotation: options.rotation ?? ((itemIndex) => direction * (itemIndex % 2 ? -1.8 : 1.8)),
        scale: options.scale ?? 0.965
      }, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: options.duration || 0.86,
        ease: options.ease || "power3.out",
        stagger: options.stagger || { each: 0.08, from: options.from || "start" },
        clearProps: "willChange",
        scrollTrigger: {
          trigger: group,
          start: options.start || "top 84%",
          once: true
        }
      });
    });
  };

  revealGroup(".intro-strip .strip-grid", { children: ":scope > div", y: 44, x: 0, rotation: 0, stagger: { each: 0.11, from: "center" } });
  revealGroup(".programs-carousel", { children: ".program-card", y: 34, x: (index) => index % 2 ? 30 : -30, rotation: (index) => index % 2 ? 1.5 : -1.5, stagger: { each: 0.09, from: "start" } });
  revealGroup(".materials-carousel", { children: ".material-slide", y: 54, x: (index) => index % 2 ? 42 : -42, rotation: (index) => index % 2 ? -2.5 : 2.5, stagger: { each: 0.075, from: "center" } });
  revealGroup(".mini-grid", { children: ":scope > article", y: 38, x: 0, rotation: (index) => (index - 1) * 1.4, stagger: { each: 0.08, from: "edges" } });
  revealGroup(".cases-grid", { children: ":scope > figure", y: 58, x: (index) => (index - 1.5) * 22, rotation: (index) => (index - 1.5) * 2.2, stagger: { each: 0.1, from: "start" } });
  revealGroup(".reviews-track", { children: ".review-slide", y: 34, x: 36, rotation: -1.4, stagger: { each: 0.06, from: "start" } });

  select(".scoreboard").forEach((scoreboard) => {
    const rows = select(".score-row", scoreboard);
    gsap.fromTo(rows, {
      autoAlpha: 0,
      x: (index) => index % 2 ? 44 : -44,
      scaleX: 0.96,
      transformOrigin: "50% 50%"
    }, {
      autoAlpha: 1,
      x: 0,
      scaleX: 1,
      duration: 0.76,
      stagger: 0.12,
      clearProps: "willChange",
      scrollTrigger: {
        trigger: scoreboard,
        start: "top 82%",
        once: true
      }
    });
  });

  select(".about-grid, .education-layout, .individual-offer, .contacts-grid").forEach((group) => {
    const children = select(":scope > *", group);
    gsap.fromTo(children, {
      autoAlpha: 0,
      y: (index) => index ? 34 : 18,
      x: (index) => index ? 26 : -26,
      scale: 0.97
    }, {
      autoAlpha: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration: 0.86,
      stagger: 0.12,
      clearProps: "willChange",
      scrollTrigger: {
        trigger: group,
        start: "top 82%",
        once: true
      }
    });
  });

  if (exists(".hero-visual")) {
    gsap.to(".hero-visual", {
      yPercent: -7,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.8
      }
    });
  }

  if (exists(".proof-panel")) {
    gsap.to(".proof-panel", {
      yPercent: -18,
      xPercent: 8,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.9
      }
    });
  }

  if (exists(".programs-carousel")) {
    gsap.to(".programs-carousel", {
      xPercent: -2,
      ease: "none",
      scrollTrigger: {
        trigger: "#programs",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.1
      }
    });
  }

  select(".section-band").forEach((section) => {
    gsap.fromTo(section, {
      "--bandShift": "-28px"
    }, {
      "--bandShift": "28px",
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });
  });

  select(".score-row strong, .program-top strong, .metrics strong, .individual-price strong").forEach((item) => {
    const value = item.textContent.trim();
    const match = value.match(/^(\d[\d\s]*)(\+| ₽| ч)?$/);
    if (!match) return;

    const number = parseInt(match[1].replace(/\s/g, ""), 10);
    const suffix = match[2] || "";
    const counter = { value: 0 };

    gsap.to(counter, {
      value: number,
      duration: number >= 1000 ? 1.65 : 1.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: item,
        start: "top 88%",
        once: true
      },
      onUpdate: () => {
        item.textContent = `${formatNumber(counter.value)}${suffix}`;
      }
    });
  });

  const hoverSelectors = ".button, .carousel-button, .contact-link, .program-card, .strip-grid > div, .mini-grid article, .cases-grid figure, .review-zoom";
  select(hoverSelectors).forEach((element) => {
    element.addEventListener("mouseenter", () => {
      gsap.to(element, { y: -4, scale: 1.01, duration: 0.22, overwrite: "auto" });
    });
    element.addEventListener("mouseleave", () => {
      gsap.to(element, { y: 0, scale: 1, duration: 0.28, overwrite: "auto" });
    });
    element.addEventListener("pointerdown", () => {
      gsap.to(element, { scale: 0.985, duration: 0.1, overwrite: "auto" });
    });
    element.addEventListener("pointerup", () => {
      gsap.to(element, { scale: 1.01, duration: 0.16, overwrite: "auto" });
    });
  });

  select(".button, .contact-link").forEach((element) => {
    const xTo = gsap.quickTo(element, "x", { duration: 0.32, ease: "power3.out" });

    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();
      xTo((event.clientX - rect.left - rect.width / 2) * 0.08);
    });

    element.addEventListener("mouseleave", () => {
      xTo(0);
    });
  });

  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  }, { once: true });
})();
