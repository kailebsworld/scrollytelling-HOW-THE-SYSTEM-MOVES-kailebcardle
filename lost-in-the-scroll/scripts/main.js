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
    const switchWordSets = [
      ["I WANT", "TO CONTROL", "THE SYSTEM"],
      ["IF TRUE", "KEEP CALM", "MODE A"],
      ["ELSE", "TRIGGER CHAOS", "MODE B"],
      ["CLASSLIST", "TOGGLE()", "SWITCH STATE"]
    ];
    let activeWordSetIndex = -1;

    const setSceneWords = (words) => {
      if (!sceneWords.length) {
        return;
      }

      sceneWords.forEach((word, index) => {
        const blockIndex = Math.floor(index / 4);
        word.textContent = words[blockIndex] || words[words.length - 1];
      });
    };

    const setSceneWordSet = (index) => {
      if (index === activeWordSetIndex || !switchWordSets[index]) {
        return;
      }
      activeWordSetIndex = index;
      setSceneWords(switchWordSets[index]);
    };

    gsap.set(sceneContainer, { autoAlpha: 1, xPercent: 22 });
    gsap.set(controlWrap, { autoAlpha: 0, y: 80, scale: 0.96 });
    gsap.set(cuboids, { yPercent: 80 });
    gsap.set(".control-side", { x: -35, autoAlpha: 0 });
    setSceneWordSet(0);

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
  const conditionalsSide = document.querySelector(".conditionals-side");
  const conditionalsMain = document.querySelector(".conditionals-main");
  const switchScene = document.querySelector(".section--switch");
  const switchWrap = document.querySelector(".switch-wrap");
  const memoryScene = document.querySelector(".section--memory");
  const memoryWrap = document.querySelector(".memory-wrap");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  if (letterGrid) {
    const GRID_SIZE = 20;
    const totalCells = 20 * 20;
    let isPointerDown = false;
    let lastHoveredCell = null;
    let lastScrollStep = -1;
    const cells = [];

    for (let i = 0; i < totalCells; i += 1) {
      const span = document.createElement("span");
      span.className = "letter-cell";
      span.dataset.index = `${i}`;
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

      const centerIndex = Number(cell.dataset.index);
      if (Number.isNaN(centerIndex)) {
        mutateCell(cell);
        return;
      }

      const centerRow = Math.floor(centerIndex / GRID_SIZE);
      const centerCol = centerIndex % GRID_SIZE;

      for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
        for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
          const row = centerRow + rowOffset;
          const col = centerCol + colOffset;
          if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
            continue;
          }
          mutateCell(cells[row * GRID_SIZE + col]);
        }
      }
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

    if (conditionalsScene) {
      ScrollTrigger.create({
        trigger: conditionalsScene,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const step = Math.floor(self.progress * 70);
          if (step === lastScrollStep) {
            return;
          }
          lastScrollStep = step;

          const flipsPerStep = self.direction > 0 ? 5 : 3;
          for (let i = 0; i < flipsPerStep; i += 1) {
            mutateCell(cells[Math.floor(Math.random() * cells.length)]);
          }
        }
      });
    }
  }

  if (
    controlScene &&
    firstContactScene &&
    conditionalsScene &&
    switchScene &&
    storyGridWorld &&
    conditionalsWrap &&
    switchWrap
  ) {
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
      gsap.set(firstContactWrapper, { xPercent: -24, yPercent: 24, scale: 1, autoAlpha: 0 });
    }
    gsap.set(conditionalsWrap, {
      autoAlpha: 1,
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: () => -winH * 1.4,
      left: "50%",
      top: "50%",
      scale: 1
    });
    const getSwitchOffscreenX = () => (winW + switchWrap.offsetWidth) / 2 + 96;

    gsap.set(switchWrap, {
      autoAlpha: 0,
      xPercent: -50,
      yPercent: -50,
      x: () => getSwitchOffscreenX(),
      y: 0,
      left: "50%",
      top: "50%",
      scale: 1
    });
    if (conditionalsSide) {
      gsap.set(conditionalsSide, { autoAlpha: 1, yPercent: 0 });
    }
    if (conditionalsMain) {
      gsap.set(conditionalsMain, { autoAlpha: 1, yPercent: 0 });
    }

    const transitionTotal = 3.4;
    const lerp = gsap.utils.interpolate;

    ScrollTrigger.create({
      trigger: controlScene,
      endTrigger: switchScene,
      start: "top top",
      end: "bottom+=45% bottom",
      scrub: true,
      onUpdate: (self) => {
        const t = self.progress * transitionTotal;

        let gridScale = 1;
        let gridYPercent = 0;

        if (t <= 0.28) {
          const p = clamp(t / 0.28);
          gridScale = lerp(1, 2.08, p);
          gridYPercent = lerp(0, -66, p);
        } else if (t <= 1.03) {
          gridScale = 2.08;
          gridYPercent = -66;
        } else if (t <= 1.26) {
          const p = clamp((t - 1.03) / (1.26 - 1.03));
          gridScale = lerp(2.08, 1.16, p);
          gridYPercent = lerp(-66, 4, p);
        } else if (t <= 1.96) {
          gridScale = 1.16;
          gridYPercent = 4;
        } else if (t <= 3.04) {
          const p = clamp((t - 1.96) / (3.04 - 1.96));
          gridScale = lerp(1.16, 2.36, p);
          gridYPercent = lerp(4, 74, p);
        } else {
          const p = clamp((t - 3.04) / (transitionTotal - 3.04));
          gridScale = lerp(2.36, 2.62, p);
          gridYPercent = lerp(74, 87, p);
        }

        gsap.set(storyGridWorld, {
          scale: gridScale,
          yPercent: gridYPercent
        });

        const controlP = clamp((t - 0.28) / (0.66 - 0.28));
        gsap.set(controlWrap, {
          yPercent: lerp(0, -24, controlP),
          autoAlpha: lerp(1, 0.45, controlP)
        });
        gsap.set(sceneContainer, {
          xPercent: lerp(22, 12, controlP)
        });

        let conditionalsY = -winH * 1.4;
        if (t <= 1.26) {
          conditionalsY = -winH * 1.4;
        } else if (t <= 1.58) {
          const p = clamp((t - 1.26) / (1.58 - 1.26));
          conditionalsY = lerp(-winH * 1.4, 0, p);
        } else if (t <= 1.96) {
          conditionalsY = 0;
        } else {
          const p = clamp((t - 1.96) / (3.04 - 1.96));
          conditionalsY = lerp(0, winH * 2.35, p);
        }

        gsap.set(conditionalsWrap, { y: conditionalsY });

        let switchAlpha = 0;
        let switchX = getSwitchOffscreenX();
        const switchInStart = 2.04;
        const switchInEnd = 3.04;

        if (t <= switchInStart) {
          switchAlpha = 0;
          switchX = getSwitchOffscreenX();
        } else if (t <= switchInEnd) {
          const p = clamp((t - switchInStart) / (switchInEnd - switchInStart));
          switchAlpha = lerp(0, 1, p);
          switchX = lerp(getSwitchOffscreenX(), 0, p);
        } else {
          switchAlpha = 1;
          switchX = 0;
        }

        gsap.set(switchWrap, {
          autoAlpha: switchAlpha,
          x: switchX,
          y: 0,
          scale: 1
        });

        if (firstContactWrapper) {
          let contactAlpha = 0;
          if (t > 0.74 && t <= 0.82) {
            const p = clamp((t - 0.74) / (0.82 - 0.74));
            contactAlpha = lerp(0, 1, p);
          } else if (t <= 1.12) {
            contactAlpha = t >= 0.82 ? 1 : 0;
          } else if (t <= 1.22) {
            const p = clamp((t - 1.12) / (1.22 - 1.12));
            contactAlpha = lerp(1, 0, p);
          }

          gsap.set(firstContactWrapper, {
            autoAlpha: contactAlpha,
            xPercent: -24,
            yPercent: -3,
            scale: 1.24
          });
        }
      }
    });
  }

  if (switchScene && memoryScene && switchWrap && memoryWrap && storyGridWorld) {
    const lerp = gsap.utils.interpolate;

    gsap.set(memoryWrap, {
      autoAlpha: 0,
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      left: "50%",
      top: "50%",
      scale: 1
    });

    ScrollTrigger.create({
      trigger: switchScene,
      start: "bottom+=45% bottom",
      endTrigger: memoryScene,
      end: "top top",
      scrub: true,
      onUpdate: (self) => {
        const p = clamp(self.progress);
        const teardown = clamp((p - 0.82) / 0.18);
        const memoryIn = clamp((p - 0.88) / 0.12);

        if (
          window.switchTorusControls &&
          typeof window.switchTorusControls.setDiveProgress === "function"
        ) {
          window.switchTorusControls.setDiveProgress(p);
        }

        gsap.set(storyGridWorld, {
          autoAlpha: lerp(0.82, 0, teardown)
        });

        gsap.set(switchWrap, {
          autoAlpha: lerp(1, 0, teardown),
          x: 0,
          y: 0,
          scale: 1
        });

        gsap.set(memoryWrap, {
          autoAlpha: memoryIn,
          y: 0,
          scale: 1
        });
      }
    });
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
