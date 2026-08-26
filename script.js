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

const programsCarousel = document.querySelector("[data-programs-carousel]");

if (programsCarousel) {
  const programsTrack = programsCarousel.querySelector("[data-programs-track]");
  const programSlides = Array.from(programsCarousel.querySelectorAll(".program-card"));
  const programsPrev = programsCarousel.querySelector("[data-programs-prev]");
  const programsNext = programsCarousel.querySelector("[data-programs-next]");
  const programsCount = programsCarousel.querySelector("[data-programs-count]");
  const programsDots = programsCarousel.querySelector("[data-programs-dots]");
  const reduceProgramsMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeProgram = 0;

  const updatePrograms = (index) => {
    activeProgram = Math.max(0, Math.min(index, programSlides.length - 1));
    programsCount.textContent = `${activeProgram + 1} / ${programSlides.length}`;
    programsPrev.disabled = activeProgram === 0;
    programsNext.disabled = activeProgram === programSlides.length - 1;

    programSlides.forEach((slide, slideIndex) => {
      if (slideIndex !== activeProgram) {
        const details = slide.querySelector(".program-details");
        if (details) details.open = false;
      }
    });

    programsDots.querySelectorAll(".carousel-dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeProgram);
      dot.setAttribute("aria-current", dotIndex === activeProgram ? "true" : "false");
    });
  };

  const showProgram = (index) => {
    const target = programSlides[Math.max(0, Math.min(index, programSlides.length - 1))];
    target.scrollIntoView({
      behavior: reduceProgramsMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "start"
    });
  };

  programSlides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Показать курс ${index + 1}`);
    dot.addEventListener("click", () => showProgram(index));
    programsDots.append(dot);
  });

  programsPrev.addEventListener("click", () => showProgram(activeProgram - 1));
  programsNext.addEventListener("click", () => showProgram(activeProgram + 1));

  programsTrack.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showProgram(activeProgram + (event.key === "ArrowRight" ? 1 : -1));
    }
  });

  programsTrack.addEventListener("scroll", () => {
    const trackLeft = programsTrack.getBoundingClientRect().left;
    const closest = programSlides.reduce((best, slide, index) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - trackLeft);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Infinity });
    updatePrograms(closest.index);
  }, { passive: true });

  updatePrograms(0);
}


const materialsCarousel = document.querySelector("[data-materials-carousel]");

if (materialsCarousel) {
  const materialsTrack = materialsCarousel.querySelector("[data-materials-track]");
  const materialSlides = Array.from(materialsCarousel.querySelectorAll(".material-slide"));
  const materialsPrev = materialsCarousel.querySelector("[data-materials-prev]");
  const materialsNext = materialsCarousel.querySelector("[data-materials-next]");
  const materialsCount = materialsCarousel.querySelector("[data-materials-count]");
  const materialsDots = materialsCarousel.querySelector("[data-materials-dots]");
  const reduceMaterialsMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeMaterial = 0;

  const updateMaterials = (index) => {
    activeMaterial = Math.max(0, Math.min(index, materialSlides.length - 1));
    materialsCount.textContent = `${activeMaterial + 1} / ${materialSlides.length}`;
    materialsPrev.disabled = activeMaterial === 0;
    materialsNext.disabled = activeMaterial === materialSlides.length - 1;
    materialsDots.querySelectorAll(".carousel-dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeMaterial);
      dot.setAttribute("aria-current", dotIndex === activeMaterial ? "true" : "false");
    });
  };

  const showMaterial = (index) => {
    const target = materialSlides[Math.max(0, Math.min(index, materialSlides.length - 1))];
    target.scrollIntoView({
      behavior: reduceMaterialsMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "start"
    });
  };

  materialSlides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Показать материал ${index + 1}`);
    dot.addEventListener("click", () => showMaterial(index));
    materialsDots.append(dot);
  });

  materialsPrev.addEventListener("click", () => showMaterial(activeMaterial - 1));
  materialsNext.addEventListener("click", () => showMaterial(activeMaterial + 1));

  materialsTrack.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showMaterial(activeMaterial + (event.key === "ArrowRight" ? 1 : -1));
    }
  });

  materialsTrack.addEventListener("scroll", () => {
    const trackLeft = materialsTrack.getBoundingClientRect().left;
    const closest = materialSlides.reduce((best, slide, index) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - trackLeft);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Infinity });
    updateMaterials(closest.index);
  }, { passive: true });

  updateMaterials(0);
}



const reviewsCarousel = document.querySelector("[data-reviews-carousel]");

if (reviewsCarousel) {
  const reviewsTrack = reviewsCarousel.querySelector("[data-reviews-track]");
  const reviewSlides = Array.from(reviewsCarousel.querySelectorAll(".review-slide"));
  const reviewsPrev = reviewsCarousel.querySelector("[data-reviews-prev]");
  const reviewsNext = reviewsCarousel.querySelector("[data-reviews-next]");
  const reviewsCount = reviewsCarousel.querySelector("[data-reviews-count]");
  const reviewDialog = document.querySelector("[data-review-dialog]");
  const reviewDialogImage = reviewDialog.querySelector("[data-review-dialog-image]");
  const reviewDialogClose = reviewDialog.querySelector("[data-review-dialog-close]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeReview = 0;

  const updateReviews = (index) => {
    activeReview = Math.max(0, Math.min(index, reviewSlides.length - 1));
    reviewsCount.textContent = `${activeReview + 1} / ${reviewSlides.length}`;
    reviewsPrev.disabled = activeReview === 0;
    reviewsNext.disabled = activeReview === reviewSlides.length - 1;
  };

  const showReview = (index) => {
    const target = reviewSlides[Math.max(0, Math.min(index, reviewSlides.length - 1))];
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest", inline: "start" });
  };

  reviewsPrev.addEventListener("click", () => showReview(activeReview - 1));
  reviewsNext.addEventListener("click", () => showReview(activeReview + 1));

  reviewsTrack.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showReview(activeReview + (event.key === "ArrowRight" ? 1 : -1));
    }
  });

  reviewsTrack.addEventListener("scroll", () => {
    const trackLeft = reviewsTrack.getBoundingClientRect().left;
    const closest = reviewSlides.reduce((best, slide, index) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - trackLeft);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Infinity });
    updateReviews(closest.index);
  }, { passive: true });

  reviewSlides.forEach((slide) => {
    const zoomButton = slide.querySelector(".review-zoom");
    const sourceImage = slide.querySelector("img");
    zoomButton.addEventListener("click", () => {
      reviewDialogImage.src = sourceImage.currentSrc || sourceImage.src;
      reviewDialogImage.alt = sourceImage.alt;
      reviewDialog.showModal();
    });
  });

  reviewDialogClose.addEventListener("click", () => reviewDialog.close());
  reviewDialog.addEventListener("click", (event) => {
    if (event.target === reviewDialog) reviewDialog.close();
  });

  updateReviews(0);
}
