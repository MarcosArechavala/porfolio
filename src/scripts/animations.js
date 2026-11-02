import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function initAnimations() {
  const mm = gsap.matchMedia();

  // Everything motion-related only runs when the user hasn't asked for reduced motion.
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // --- Hero intro timeline ---
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
    tl.from(".hero__reveal", { y: 40, autoAlpha: 0, stagger: 0.12 })
      .from(".code-card", { y: 60, rotateX: 12, autoAlpha: 0, duration: 1.2 }, 0.3)
      .from(".float-chip", { scale: 0.6, autoAlpha: 0, stagger: 0.15, ease: "back.out(2)" }, 0.9);

    // Floating chips idle motion
    gsap.to(".float-chip--1", { y: -10, duration: 2.6, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".float-chip--2", { y: 10, duration: 3.1, repeat: -1, yoyo: true, ease: "sine.inOut" });

    // Hero parallax on scroll
    gsap.to(".hero__visual", {
      yPercent: -12,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".hero__glow--1", {
      yPercent: 40,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });

    // --- Generic block reveals ---
    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.from(el, {
        y: 50,
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    });

    // --- Staggered grids ---
    gsap.set(".reveal-item", { autoAlpha: 0 });
    ScrollTrigger.batch(".reveal-item", {
      start: "top 88%",
      once: true,
      onEnter: (batch) =>
        gsap.fromTo(
          batch,
          { y: 50, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.1, overwrite: true }
        ),
    });

    // --- Mock dashboard bars grow in ---
    gsap.from(".mock__chart span", {
      scaleY: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.07,
      scrollTrigger: { trigger: ".mock", start: "top 80%" },
    });

    // --- Subtle 3D tilt on the code card following the cursor ---
    const card = document.querySelector(".code-card");
    const visual = document.querySelector(".hero__visual");
    if (card && visual && window.matchMedia("(pointer: fine)").matches) {
      const rx = gsap.quickTo(card, "rotateX", { duration: 0.6, ease: "power3" });
      const ry = gsap.quickTo(card, "rotateY", { duration: 0.6, ease: "power3" });
      gsap.set(visual, { perspective: 1000 });
      const hero = document.querySelector(".hero");
      hero.addEventListener("pointermove", (e) => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        ry(x * 10);
        rx(-y * 8);
      });
      hero.addEventListener("pointerleave", () => {
        rx(0);
        ry(0);
      });
    }
  });
}
