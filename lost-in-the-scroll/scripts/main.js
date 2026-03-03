if (typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof window.gsap === "undefined" || typeof window.ScrollTrigger === "undefined") {
    return;
  }

  const counter = document.getElementById("counter");
  const counterOutline = document.getElementById("counter-outline");
  const progressBar = document.querySelector(".progress");
  const messages = document.querySelectorAll(".message");
  const markers = document.querySelectorAll(".marker");
  const blocks = document.querySelectorAll(".block");

  const line0to25 = document.getElementById("line-0-25");
  const line25to50 = document.getElementById("line-25-50");
  const line50to75 = document.getElementById("line-50-75");
  const line75to100 = document.getElementById("line-75-100");

  const topRow = document.getElementById("top-row");
  const bottomRow = document.getElementById("bottom-row");
  const leftColumn = document.getElementById("left-column");
  const rightColumn = document.getElementById("right-column");

  let lastMessageIndex = -1;
  const state = { p: 0 };

  ScrollTrigger.create({
    trigger: ".scroll-loader",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      state.p = Math.round(self.progress * 100);
      render(state.p);
    }
  });

  function render(p) {
    counter.textContent = p;
    counterOutline.textContent = p;

    progressBar.style.width = `${p}%`;

    topRow.style.width = `${p}%`;
    bottomRow.style.width = `${p}%`;
    leftColumn.style.height = `${p}%`;
    rightColumn.style.height = `${p}%`;

    markers.forEach((marker) => {
      const position = parseInt(marker.getAttribute("data-position"), 10);
      marker.style.opacity = p >= position ? 1 : 0.6;
    });

    line0to25.style.transform = `scaleX(${clamp((p - 0) / 25)})`;
    line25to50.style.transform = `scaleX(${clamp((p - 25) / 25)})`;
    line50to75.style.transform = `scaleX(${clamp((p - 50) / 25)})`;
    line75to100.style.transform = `scaleX(${clamp((p - 75) / 25)})`;

    blocks[0].style.transform = `scale(${clamp((p - 20) / 20)})`;
    blocks[1].style.transform = `scale(${clamp((p - 40) / 20)})`;
    blocks[2].style.transform = `scale(${clamp((p - 60) / 20)})`;
    blocks[3].style.transform = `scale(${clamp((p - 80) / 20)})`;

    const activeIndex = Math.min(4, Math.floor(p / 20));
    if (activeIndex !== lastMessageIndex) {
      messages.forEach((message) => message.classList.remove("active"));
      messages[activeIndex].classList.add("active");
      lastMessageIndex = activeIndex;
    }
  }

  function clamp(v) {
    return Math.max(0, Math.min(1, v));
  }

  render(0);

  const sceneContainer = document.querySelector(".control-scene .container");
  const cuboids = document.querySelectorAll(".control-scene .hi__cuboid");
  const sceneWords = document.querySelectorAll(".control-scene .hi__word");
  const wireGrid = document.querySelector(".wire-grid");
  const controlScene = document.querySelector(".control-scene");
  const controlWrap = document.querySelector(".control-wrap");
  const contentScene = document.querySelector(".content");
  const contentInner = document.querySelector(".content > div");
  let winW = window.innerWidth;
  let winH = window.innerHeight;

  if (sceneContainer && cuboids.length && controlScene && controlWrap) {
    gsap.set(sceneContainer, { autoAlpha: 1 });
    gsap.set(controlWrap, { autoAlpha: 0, y: 80, scale: 0.96 });
    gsap.set(cuboids, { yPercent: 80 });
    gsap.set(".control-side", { x: -35, autoAlpha: 0 });

    if (contentScene && contentInner && wireGrid && controlWrap) {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: contentScene,
            start: "top 40%",
            end: "bottom 70%",
            scrub: true
          }
        })
        .to(
          contentInner,
          {
            autoAlpha: 0,
            y: -120,
            ease: "none"
          },
          0
        )
        .to(
          wireGrid,
          {
            opacity: 0.82,
            ease: "none"
          },
          0
        )
        .to(
          controlWrap,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: "none"
          },
          0
        )
        .to(
          cuboids,
          {
            yPercent: 0,
            stagger: 0.08,
            ease: "none"
          },
          0
        )
        .to(
          ".control-side",
          {
            x: 0,
            autoAlpha: 0.95,
            ease: "none"
          },
          0
        );
    }

    gsap.to(cuboids, {
      rotateX: "-=360",
      duration: 12,
      repeat: -1,
      ease: "none"
    });

    gsap.fromTo(
      cuboids,
      {
        rotateY: 6,
        rotate: -4
      },
      {
        rotateY: -6,
        rotate: 4,
        duration: 3.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      }
    );

    ScrollTrigger.create({
      trigger: controlScene,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const gridY = gsap.utils.mapRange(0, 1, 10, -10, self.progress);
        const wordY = gsap.utils.mapRange(0, 1, 120, -140, self.progress);
        if (wireGrid) {
          gsap.set(wireGrid, { yPercent: gridY });
        }
        gsap.set(".hi", { y: wordY });
      }
    });

    const hiRotateYTo = gsap.quickTo(".hi", "rotateY", {
      duration: 0.8,
      ease: "power3.out"
    });
    const hiRotateZTo = gsap.quickTo(".hi", "rotateZ", {
      duration: 0.8,
      ease: "power3.out"
    });
    const wordXTo = gsap.quickTo(sceneWords, "xPercent", {
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.015
    });
    const wordSkewTo = gsap.quickTo(sceneWords, "skewX", {
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.015
    });

    const followPointer = (xPos, yPos) => {
      const nX = (2 * (xPos - winW / 2)) / winW;
      const nY = (-2 * (yPos - winH / 2)) / winH;
      wordXTo(nX * 8);
      wordSkewTo(nX * 4);
      hiRotateYTo(nX * 10);
      hiRotateZTo(nY * 4);
    };

    window.addEventListener("mousemove", (event) => {
      followPointer(event.clientX, event.clientY);
    });

    window.addEventListener(
      "touchmove",
      (event) => {
        followPointer(event.touches[0].clientX, event.touches[0].clientY);
      },
      { passive: true }
    );

    window.addEventListener("resize", () => {
      winW = window.innerWidth;
      winH = window.innerHeight;
    });
  }
});
