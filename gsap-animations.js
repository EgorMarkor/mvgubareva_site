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
    .section-band::after { transform: translate3d(0, var(--bandShift, 0), 0); will-change: transform; }
    .hero-visual, .hero-visual img, .proof-panel, .button, .carousel-button, .contact-link,
    .program-card, .strip-grid > div, .mini-grid article, .cases-grid figure, .review-zoom {
      will-change: transform;
    }
  `;
  document.head.append(style);

  document.documentElement.classList.add("gsap-ready");

  const select = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const exists = (selector) => document.querySelector(selector);

  const entranceTargets = [
    ".section-heading",
    ".strip-grid > div",
    ".program-card",
    ".material-slide",
    ".scoreboard",
    ".mini-grid article",
    ".about-photo",
    ".about-copy",
    ".education-carousel",
    ".cases-grid figure",
    ".review-slide",
    ".individual-offer",
    ".contacts-grid > *"
  ].join(",");

  gsap.set(entranceTargets, {
    autoAlpha: 0,
    y: 34,
    willChange: "transform, opacity"
  });

  const heroTimeline = gsap.timeline({
    defaults: { duration: 0.95, ease: "power3.out" }
  });

  heroTimeline
    .from(".site-header", { autoAlpha: 0, y: -22, duration: 0.7 })
    .from(".hero .eyebrow", { autoAlpha: 0, y: 18 }, "-=0.25")
    .from(".hero h1", { autoAlpha: 0, y: 28 }, "-=0.58")
    .from(".hero .lead", { autoAlpha: 0, y: 22 }, "-=0.6")
    .from(".hero-actions .button", { autoAlpha: 0, y: 18, stagger: 0.08 }, "-=0.5")
    .from(".metrics > div", { autoAlpha: 0, y: 26, stagger: 0.09 }, "-=0.42")
    .from(".hero-visual img", { autoAlpha: 0, y: 36, scale: 0.965, rotation: 1.2 }, "-=1.0")
    .from(".proof-panel", { autoAlpha: 0, y: 24, scale: 0.94 }, "-=0.52");

  ScrollTrigger.batch(entranceTargets, {
    start: "top 84%",
    once: true,
    interval: 0.08,
    batchMax: 6,
    onEnter: (batch) => {
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: 0.78,
        stagger: { each: 0.08, from: "start" },
        clearProps: "willChange"
      });
    }
  });

  if (exists(".hero-visual")) {
    gsap.to(".hero-visual", {
      yPercent: -5,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.8
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

  select(".score-row strong, .program-top strong, .metrics strong").forEach((item) => {
    const value = item.textContent.trim();
    if (!/^\d+\+?$/.test(value)) return;

    const number = parseInt(value, 10);
    const suffix = value.endsWith("+") ? "+" : "";
    const counter = { value: 0 };

    gsap.to(counter, {
      value: number,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: item,
        start: "top 88%",
        once: true
      },
      onUpdate: () => {
        item.textContent = `${Math.round(counter.value)}${suffix}`;
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

  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  }, { once: true });
})();
