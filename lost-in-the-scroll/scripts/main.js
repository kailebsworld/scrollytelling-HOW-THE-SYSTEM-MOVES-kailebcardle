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
  const storyGridWorld = document.querySelector(".story-grid-world");
  const controlScene = document.querySelector(".control-scene");
  const controlWrap = document.querySelector(".control-wrap");
  const contentScene = document.querySelector(".content");
  const contentInner = document.querySelector(".content > div");
  const firstContactScene = document.querySelector(".section--first-contact");
  const firstContactWrapper = document.getElementById("first-contact-wrapper");
  let winW = window.innerWidth;
  let winH = window.innerHeight;

  if (sceneContainer && cuboids.length && controlScene && controlWrap) {
    gsap.set(sceneContainer, { autoAlpha: 1, xPercent: 22 });
    gsap.set(controlWrap, { autoAlpha: 0, y: 80, scale: 0.96 });
    gsap.set(cuboids, { yPercent: 80 });
    gsap.set(".control-side", { x: -35, autoAlpha: 0 });

    if (contentScene && contentInner && storyGridWorld && controlWrap) {
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
        const wordY = gsap.utils.mapRange(0, 1, 120, -140, self.progress);
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

  const spinWrapper = document.getElementById("first-contact-wrapper");

  if (spinWrapper) {
    makeInstance("DEV CONTROLS", 10, 0.12, spinWrapper);
  }

  const letterGrid = document.getElementById("main-container");
  const conditionalsScene = document.querySelector(".section--conditionals");
  const conditionalsWrap = document.querySelector(".conditionals-wrap");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  if (letterGrid) {
    const totalCells = 20 * 20;
    let isPointerDown = false;
    let lastHoveredCell = null;
    const cells = [];

    for (let i = 0; i < totalCells; i += 1) {
      const span = document.createElement("span");
      span.className = "letter-cell";
      span.textContent = alphabet[Math.floor(Math.random() * alphabet.length)];
      letterGrid.appendChild(span);
      cells.push(span);
    }

    const selectedCell = cells[9 * 20 + 7];
    const targetCell = cells[10 * 20 + 14];
    const warningCell = cells[7 * 20 + 16];

    if (selectedCell) {
      selectedCell.textContent = "W";
      selectedCell.classList.add("is-selected");
    }

    if (targetCell) {
      targetCell.textContent = "V";
      targetCell.classList.add("is-target");
    }

    if (warningCell) {
      warningCell.textContent = "F";
      warningCell.classList.add("is-warning");
    }

    const mutateCell = (cell) => {
      if (!cell || !cell.classList.contains("letter-cell")) {
        return;
      }

      const currentLetter = cell.textContent;
      let nextLetter = currentLetter;
      const isPinnedCell =
        cell.classList.contains("is-selected") ||
        cell.classList.contains("is-target") ||
        cell.classList.contains("is-warning");

      if (!isPinnedCell) {
        while (nextLetter === currentLetter) {
          nextLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }

      cell.textContent = nextLetter;
      cell.classList.add("is-active");

      gsap.killTweensOf(cell);
      gsap.fromTo(
        cell,
        { rotateX: 0, rotateY: 0, color: "rgba(247, 247, 247, 1)" },
        {
          rotateX: 180,
          rotateY: 180,
          color: "rgba(247, 247, 247, 0.3)",
          duration: 0.28,
          ease: "power1.out",
          clearProps: "color",
          onComplete: () => {
            cell.classList.remove("is-active");
            gsap.to(cell, {
              rotateX: 0,
              rotateY: 0,
              duration: 0.22,
              ease: "power1.inOut"
            });
          }
        }
      );
    };

    const mutateFromPointer = (event) => {
      const cell = event.target.closest(".letter-cell");
      if (!cell || cell === lastHoveredCell) {
        return;
      }
      lastHoveredCell = cell;
      mutateCell(cell);
    };

    letterGrid.addEventListener("pointerdown", (event) => {
      isPointerDown = true;
      mutateFromPointer(event);
    });

    letterGrid.addEventListener("pointerover", mutateFromPointer);

    letterGrid.addEventListener("pointermove", (event) => {
      if (!isPointerDown && event.pointerType !== "mouse") {
        return;
      }
      mutateFromPointer(event);
    });

    letterGrid.addEventListener("pointerleave", () => {
      lastHoveredCell = null;
    });

    window.addEventListener("pointerup", () => {
      isPointerDown = false;
      lastHoveredCell = null;
    });

    window.addEventListener("pointercancel", () => {
      isPointerDown = false;
      lastHoveredCell = null;
    });
  }

  if (controlScene && firstContactScene && conditionalsScene && storyGridWorld && conditionalsWrap) {
    gsap.set(storyGridWorld, {
      transformOrigin: "50% 50%",
      scale: 1,
      yPercent: 0,
      autoAlpha: 0,
      force3D: true
    });

    gsap.to(storyGridWorld, {
      autoAlpha: 0.82,
      ease: "none",
      scrollTrigger: {
        trigger: controlScene,
        start: "top bottom",
        end: "top top",
        scrub: true
      }
    });

    if (firstContactWrapper) {
      gsap.set(firstContactWrapper, { xPercent: 0, yPercent: 0, scale: 1, autoAlpha: 0 });
    }
    gsap.set(conditionalsWrap, { autoAlpha: 0, yPercent: 18, scale: 0.92 });

    const worldTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: controlScene,
        endTrigger: conditionalsScene,
        start: "top top",
        end: "bottom+=35% bottom",
        scrub: true
      }
    });

    worldTimeline
      .to(
        storyGridWorld,
        {
          scale: 1,
          yPercent: 0,
          ease: "none",
          duration: 0.28
        },
        0
      )
      .to(
        storyGridWorld,
        {
          scale: 2.08,
          yPercent: -66,
          ease: "none",
          duration: 0.45
        },
        0.28
      )
      .to(
        storyGridWorld,
        {
          scale: 2.08,
          yPercent: -66,
          ease: "none",
          duration: 0.3
        },
        0.73
      )
      .to(
        storyGridWorld,
        {
          scale: 2.24,
          yPercent: 0,
          ease: "none",
          duration: 0.55
        },
        1.03
      )
      .to(
        controlWrap,
        {
          yPercent: -24,
          autoAlpha: 0.45,
          ease: "none",
          duration: 0.38
        },
        0.28
      )
      .to(
        sceneContainer,
        {
          xPercent: 12,
          ease: "none",
          duration: 0.38
        },
        0.28
      )
      .to(
        conditionalsWrap,
        {
          autoAlpha: 1,
          yPercent: 0,
          scale: 1.04,
          ease: "none",
          duration: 0.12
        },
        1.66
      );

    if (firstContactWrapper) {
      worldTimeline
        .to(
          firstContactWrapper,
          {
            autoAlpha: 1,
            xPercent: -40,
            yPercent: 16,
            scale: 1.24,
            ease: "none",
            duration: 0.08
          },
          0.74
        )
        .to(
          firstContactWrapper,
          {
            xPercent: -40,
            yPercent: 16,
            autoAlpha: 1,
            ease: "none",
            duration: 0.3
          },
          0.82
        )
        .to(
          firstContactWrapper,
          {
            autoAlpha: 0,
            ease: "none",
            duration: 0.12
          },
          1.22
        );
    }
  }

  function makeInstance(word, amount, offset, wrapper) {
    const templateElement = document.createElement("div");
    templateElement.classList.add("first-contact-word-template");
    templateElement.textContent = word;
    wrapper.appendChild(templateElement);

    for (let i = 0; i < amount; i += 1) {
      const wordElement = document.createElement("div");
      wordElement.classList.add("first-contact-word-instance");
      wordElement.style.animationDelay = `${offset * i}s`;
      wordElement.textContent = word;
      wrapper.appendChild(wordElement);
    }
  }
});
