document.addEventListener("DOMContentLoaded", () => {
  const triggers = Array.from(document.querySelectorAll(".narrative-trigger[data-narrative-step]"));
  const overlay = document.getElementById("narrative-overlay");
  if (!triggers.length || !overlay) {
    return;
  }

  const panel = overlay.querySelector(".narrative-panel");
  const header = document.getElementById("narrative-header");
  const title = document.getElementById("narrative-title");
  const metaphor = document.getElementById("narrative-metaphor");
  const js = document.getElementById("narrative-js");
  const shifted = document.getElementById("narrative-shifted");
  const overlayDismiss = overlay.querySelector("[data-overlay-dismiss]");

  if (
    !panel ||
    !header ||
    !title ||
    !metaphor ||
    !js ||
    !shifted ||
    !overlayDismiss
  ) {
    return;
  }

  const dataByStep = {
    "01": {
      color: "#2d5bff",
      title: '01 Opening - "I want control."',
      metaphor:
        "Everything feels slippery and unpredictable. Type moves on its own. I click buttons that dodge me.",
      jsConcept: "No concepts yet - just confusion",
      shifted:
        "I realized the problem is not chaos - it is that I have no way to grab or direct anything. I need tools."
    },
    "02": {
      color: "#ff2a2a",
      title: "02 First Contact - console.log / DevTools",
      metaphor:
        "I can finally see what the type is doing. It is not random - it has a pattern. The console shows me hidden instructions.",
      jsConcept: "console.log() + browser DevTools",
      shifted:
        'From "what is happening?" to "oh, I can see what is happening." Debugging becomes visibility, not magic.'
    },
    "03": {
      color: "#00ff00",
      title: "03 Naming Things - variables (let, const)",
      metaphor:
        'Labeling type blocks so I can grab them again. Before, everything was anonymous. Now I can point and say "this one."',
      jsConcept: "let, const, variable assignment",
      shifted:
        "I stopped feeling like I was chasing ghosts. Variables gave me handles. I could reference the same thing twice."
    },
    "04": {
      color: "#2d5bff",
      title: "04 The Switch - conditionals + classList.toggle",
      metaphor:
        'Rules that flip calm/chaos modes. "If the vibe is X, do Y." One click changes the entire visual state.',
      jsConcept: "if/else statements + classList.toggle()",
      shifted:
        "I realized I could design two states and flip between them. Control is not stopping motion - it is choreographing it."
    },
    "05": {
      color: "#ff2a2a",
      title: "05 The Memory - localStorage",
      metaphor:
        "The piece remembers yesterday's state. It does not reset every time. The chaos (or calm) persists.",
      jsConcept: "localStorage.setItem() / .getItem()",
      shifted:
        "The page stopped feeling like it forgot me. It became a space I could return to. Memory equals continuity equals relationship."
    },
    "06": {
      color: "#00ff00",
      title: '06 Closing - "I do not control it fully, but I can choreograph it."',
      metaphor:
        "The system still surprises me. But now I have the tools to shape how it surprises me. Bugs become features.",
      jsConcept: "All of the above + design tokens (stretch)",
      shifted:
        "Learning is not about mastery. It is about building a relationship with a system that is always slightly out of reach."
    }
  };

  let activeTrigger = null;

  const openOverlay = (step, trigger) => {
    const payload = dataByStep[step];
    if (!payload) {
      return;
    }

    activeTrigger = trigger || null;
    title.textContent = payload.title;
    metaphor.textContent = payload.metaphor;
    js.textContent = payload.jsConcept;
    shifted.textContent = payload.shifted;
    header.style.backgroundColor = payload.color;
    header.style.color = payload.color === "#00ff00" ? "#08120b" : "#f7f7f7";

    overlay.hidden = false;
    requestAnimationFrame(() => {
      overlay.classList.add("is-open");
    });
    document.body.classList.add("narrative-overlay-open");
  };

  const closeOverlay = () => {
    if (overlay.hidden) {
      return;
    }
    overlay.classList.remove("is-open");
    document.body.classList.remove("narrative-overlay-open");
    window.setTimeout(() => {
      overlay.hidden = true;
      if (activeTrigger && typeof activeTrigger.focus === "function") {
        activeTrigger.focus();
      }
    }, 180);
  };

  const getTriggerFromEvent = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return null;
    }
    return target.closest(".narrative-trigger[data-narrative-step]");
  };

  document.addEventListener("click", (event) => {
    const trigger = getTriggerFromEvent(event);
    if (!trigger) {
      return;
    }
    const step = trigger.getAttribute("data-narrative-step");
    if (!step) {
      return;
    }
    openOverlay(step, trigger);
  });

  document.addEventListener("keydown", (event) => {
    const trigger = getTriggerFromEvent(event);
    if (!trigger) {
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const step = trigger.getAttribute("data-narrative-step");
      if (!step) {
        return;
      }
      openOverlay(step, trigger);
    }
  });

  overlayDismiss.addEventListener("click", closeOverlay);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeOverlay();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) {
      closeOverlay();
    }
  });
});
