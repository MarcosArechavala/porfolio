import { en, esExtra } from "../data/i18n";

const STORAGE_KEY = "lang";
const nodes = () => document.querySelectorAll("[data-i18n]");

// Snapshot the Spanish (default) markup so we can switch back without reloading.
const es = { ...esExtra };

export function t(key) {
  const lang = document.documentElement.lang;
  return (lang === "en" ? en : es)[key] ?? key;
}

function apply(lang) {
  const dict = lang === "en" ? en : es;
  nodes().forEach((el) => {
    const value = dict[el.dataset.i18n];
    if (value !== undefined) el.innerHTML = value;
  });
  document.documentElement.lang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
}

export default function initI18n() {
  nodes().forEach((el) => {
    if (!(el.dataset.i18n in es)) es[el.dataset.i18n] = el.innerHTML.trim();
  });

  const saved = localStorage.getItem(STORAGE_KEY);
  const initial = saved || (navigator.language?.toLowerCase().startsWith("es") ? "es" : "en");
  if (initial !== "es") apply(initial);

  document.getElementById("lang-toggle")?.addEventListener("click", () => {
    apply(document.documentElement.lang === "es" ? "en" : "es");
  });
}

