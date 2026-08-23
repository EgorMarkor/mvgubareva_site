const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-label", "Открыть меню");
    }
  });
}

if (header) {
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 18);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

const educationCarousel = document.querySelector("[data-education-carousel]");

if (educationCarousel) {
  const track = educationCarousel.querySelector("[data-carousel-track]");
  const slides = Array.from(educationCarousel.querySelectorAll(".education-slide"));
  const prev = educationCarousel.querySelector("[data-carousel-prev]");
  const next = educationCarousel.querySelector("[data-carousel-next]");
  const count = educationCarousel.querySelector("[data-carousel-count]");
  const dots = educationCarousel.querySelector("[data-carousel-dots]");
  let activeIndex = 0;

  const updateCarousel = (index) => {
    activeIndex = Math.max(0, Math.min(index, slides.length - 1));
    count.textContent = `${activeIndex + 1} / ${slides.length}`;
    dots.querySelectorAll(".carousel-dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
      dot.setAttribute("aria-current", dotIndex === activeIndex ? "true" : "false");
    });
  };

  const scrollToSlide = (index) => {
    const target = slides[Math.max(0, Math.min(index, slides.length - 1))];
    target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Показать диплом ${index + 1}`);
    dot.addEventListener("click", () => scrollToSlide(index));
    dots.append(dot);
  });

  prev.addEventListener("click", () => scrollToSlide(activeIndex - 1));
  next.addEventListener("click", () => scrollToSlide(activeIndex + 1));

  track.addEventListener("scroll", () => {
    const trackLeft = track.getBoundingClientRect().left;
    const closest = slides.reduce((best, slide, index) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - trackLeft);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Infinity });
    updateCarousel(closest.index);
  }, { passive: true });

  updateCarousel(0);
}
