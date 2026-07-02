const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");
let lastFocusedElement = null;

document.documentElement.classList.add("js-enabled");

function getFocusableMenuItems() {
  return navigation.querySelectorAll("a[href], button:not([disabled])");
}

function closeMenu({ restoreFocus = false } = {}) {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menú");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");

  if (restoreFocus && lastFocusedElement === menuButton) {
    menuButton.focus();
  }
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";

  lastFocusedElement = document.activeElement;
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
  navigation.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);

  if (!isOpen && window.innerWidth <= 860) {
    const firstMenuLink = getFocusableMenuItems()[0];
    window.setTimeout(() => firstMenuLink?.focus({ preventScroll: true }), 0);
  } else {
    closeMenu({ restoreFocus: true });
  }
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => closeMenu());
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) {
    closeMenu({ restoreFocus: false });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu({ restoreFocus: true });
  }

  if (event.key !== "Tab" || !document.body.classList.contains("menu-open")) {
    return;
  }

  const focusableItems = Array.from(getFocusableMenuItems());
  const firstItem = focusableItems[0];
  const lastItem = focusableItems[focusableItems.length - 1];

  if (!firstItem || !lastItem) {
    return;
  }

  if (event.shiftKey && document.activeElement === firstItem) {
    event.preventDefault();
    lastItem.focus();
  } else if (!event.shiftKey && document.activeElement === lastItem) {
    event.preventDefault();
    firstItem.focus();
  }
});

const revealTargets = document.querySelectorAll(
  [
    ".hero-copy",
    ".hero-visual",
    ".problem-image",
    ".problem-copy",
    ".comparison-card",
    ".service-card",
    ".portfolio-heading",
    ".portfolio-card",
    ".closing-inner",
    ".purpose-title",
    ".purpose-copy",
    ".purpose-card",
    ".team-heading",
    ".team-card",
    ".team-day-cta",
    ".about-cta-inner",
    ".day-hero-copy",
    ".day-hero-photo",
    ".day-proof span",
    ".day-gallery-heading",
    ".day-card",
  ].join(",")
);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (revealTargets.length && !reducedMotion && "IntersectionObserver" in window) {
  revealTargets.forEach((element, index) => {
    element.classList.add("reveal-on-scroll");
    element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.12,
    }
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
}
