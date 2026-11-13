// Set a real address here to enable mailto message preparation.
const contactEmail = "";
const root = document.documentElement;
const themeToggle = document.querySelector("#theme-toggle");
const colorCycle = document.querySelector("#color-cycle");
const accentColors = [
  "#8D43F5",
  "#E67E00",
  "#C89600",
  "#268543",
  "#286CC4",
  "#098DA0",
  "#CB3645",
  "#19886F",
  "#BA339B",
];

function readPreference(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Storage can be disabled by the browser. */
  }
}

const savedTheme = readPreference("portfolio-theme");
if (savedTheme === "light" || savedTheme === "dark")
  root.dataset.theme = savedTheme;
let accentIndex = accentColors.indexOf(readPreference("portfolio-accent"));
if (accentIndex < 0) accentIndex = 0;
function setAccent(index, persist = false) {
  accentIndex = index;
  const color = accentColors[accentIndex];
  root.style.setProperty("--main-color", color);
  colorCycle.style.setProperty("--cycle-color", color);
  const channels = color
    .slice(1)
    .match(/.{2}/g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );
  const luminance =
    0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  root.style.setProperty(
    "--main-on-color",
    luminance > 0.179 ? "#171515" : "#ffffff",
  );
  colorCycle.setAttribute(
    "aria-label",
    `Change accent color; current color ${color}`,
  );
  if (persist) savePreference("portfolio-accent", color);
}
setAccent(accentIndex);

function updateThemeButton() {
  const isLight = root.dataset.theme === "light";
  themeToggle.setAttribute(
    "aria-label",
    `Switch to ${isLight ? "dark" : "light"} mode`,
  );
  themeToggle.setAttribute("aria-pressed", String(isLight));
}
updateThemeButton();
themeToggle.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  savePreference("portfolio-theme", root.dataset.theme);
  updateThemeButton();
});
colorCycle.addEventListener("click", () =>
  setAccent((accentIndex + 1) % accentColors.length, true),
);

// Accessible mobile navigation
const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");
function toggleMenu() {
  const isOpen = navbar.classList.toggle("open");
  menuIcon.setAttribute("aria-expanded", String(isOpen));
  menuIcon.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation",
  );
  menuIcon.classList.toggle("ti-menu-2", !isOpen);
  menuIcon.classList.toggle("ti-x", isOpen);
}
menuIcon.addEventListener("click", toggleMenu);
menuIcon.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleMenu();
  }
});
navbar.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navbar.classList.remove("open");
    menuIcon.setAttribute("aria-expanded", "false");
    menuIcon.setAttribute("aria-label", "Open navigation");
    menuIcon.classList.add("ti-menu-2");
    menuIcon.classList.remove("ti-x");
  }),
);

const roleText = document.querySelector(".role-text");
const roleTitles = [
  "Fullstack Developer",
  "AI Automation Specialist",
  "Videographer",
  "Photographer",
  "Video Editor",
];
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

let roleIndex = 0;
let rolePosition = roleText.textContent.length;
let deletingRole = false;
let roleTimer;

function typeRole() {
  const currentRole = roleTitles[roleIndex];
  rolePosition += deletingRole ? -1 : 1;
  roleText.textContent = currentRole.slice(0, rolePosition);

  if (!deletingRole && rolePosition >= currentRole.length) {
    deletingRole = true;
    roleTimer = window.setTimeout(typeRole, 1450);
    return;
  }
  if (deletingRole && rolePosition <= 0) {
    deletingRole = false;
    roleIndex = (roleIndex + 1) % roleTitles.length;
  }
  roleTimer = window.setTimeout(typeRole, deletingRole ? 36 : 72);
}

if (!reduceMotion) roleTimer = window.setTimeout(typeRole, 1100);

// Resume tabs: keep the existing three panels and expose selected state to assistive tech.
const resumeLists = [...document.querySelectorAll(".resume-list")];
const resumeBoxes = [...document.querySelectorAll(".resume-box")];
resumeLists.forEach((tab) =>
  tab.addEventListener("click", () => {
    resumeLists.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
    });
    resumeBoxes.forEach((box) =>
      box.classList.toggle(
        "is-active",
        box.classList.contains(tab.dataset.target),
      ),
    );
  }),
);

// Compose a message in the visitor's email app; no message is sent by this page.
const contactForm = document.querySelector("#contact-form");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = document.querySelector("#form-status");
  if (!contactEmail) {
    status.textContent =
      "Message preparation is unavailable right now. Please try again later.";
    return;
  }
  const values = new FormData(contactForm);
  const subject = encodeURIComponent(values.get("subject"));
  const body = encodeURIComponent(
    `From: ${values.get("name")} (${values.get("email")})\n\n${values.get("message")}`,
  );
  window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  status.textContent =
    "Your email app should open with the message ready to send.";
});

// GSAP progressive enhancement. Content stays visible if the CDN is unavailable.
if (window.gsap && window.ScrollTrigger && !reduceMotion) {
  gsap.registerPlugin(ScrollTrigger);
  const animationContext = gsap.context(() => {
    gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .from(".home > .home-image", { opacity: 0, y: 28, duration: 0.8 })
      .from(
        ".home-content h1, .home-content h3, .hero-description, .btn-sci",
        { opacity: 0, y: 20, duration: 0.65, stagger: 0.1 },
        "-=.55",
      );

    gsap.utils
      .toArray(".services-box, .project-card, .process-list li, .contact-panel")
      .forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 22,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });
  });
  window.addEventListener("pagehide", () => animationContext.revert(), {
    once: true,
  });
}

// Latest Projects carousel
const portfolioContainer = document.querySelector(".portfolio-container");
if (portfolioContainer) {
  const details = portfolioContainer.querySelectorAll(".portfolio-detail");
  const slide = portfolioContainer.querySelector(".img-slide");
  const images = portfolioContainer.querySelectorAll(".img-item");
  const previous = portfolioContainer.querySelector(".arrow-left");
  const next = portfolioContainer.querySelector(".arrow-right");
  let activeProject = 0;

  if (
    details.length &&
    details.length === images.length &&
    slide &&
    previous &&
    next
  ) {
    const updateProject = () => {
      details.forEach((detail, index) =>
        detail.classList.toggle("p-active", index === activeProject),
      );
      slide.style.transform = `translateX(-${activeProject * 100}%)`;
      previous.disabled = activeProject === 0;
      next.disabled = activeProject === details.length - 1;
      previous.classList.toggle("disabled", previous.disabled);
      next.classList.toggle("disabled", next.disabled);
    };

    previous.addEventListener("click", () => {
      if (activeProject > 0) {
        activeProject -= 1;
        updateProject();
      }
    });
    next.addEventListener("click", () => {
      if (activeProject < details.length - 1) {
        activeProject += 1;
        updateProject();
      }
    });
    updateProject();
  }
}
