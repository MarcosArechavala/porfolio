import { t } from "./i18n";

export default function initUI() {
  const nav = document.getElementById("nav");
  const burger = document.getElementById("nav-burger");
  const links = document.getElementById("nav-links");

  // --- Nav: background on scroll + hide on scroll down ---
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 20);
    const menuOpen = links.classList.contains("is-open");
    nav.classList.toggle("is-hidden", !menuOpen && y > lastY && y > 400);
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // --- Mobile menu ---
  const closeMenu = () => {
    links.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  };
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

  // --- Active link highlighting ---
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...links.querySelectorAll('a[href^="#"]')];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => observer.observe(s));

  // --- Card spotlight (follows cursor) ---
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  // --- Copy email ---
  const copyBtn = document.getElementById("copy-email");
  const copyLabel = document.getElementById("copy-email-label");
  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copyBtn.dataset.email);
      copyLabel.textContent = t("contact.copied");
      setTimeout(() => (copyLabel.textContent = t("contact.copy")), 2000);
    } catch {
      window.location.href = `mailto:${copyBtn.dataset.email}`;
    }
  });

  // --- Footer year ---
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

