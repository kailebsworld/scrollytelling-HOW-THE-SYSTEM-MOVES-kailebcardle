# Lost in the Scroll: How the System Moves

## Description
Lost in the Scroll is a narrative scrollytelling web project that turns JavaScript learning into a visual metaphor about power, logic, memory, and choreography. As the user scrolls, each section reveals a different "system state" through motion, typography, and interaction: a loader boot sequence, a rotating control chamber, a first-contact pulse field, a conditional letter grid, a switch transition, a memory environment, and a closing reboot loop.

The project is built as one continuous page (`lost-in-the-scroll/index.html`) with modular behavior split across JavaScript files. `scripts/main.js` orchestrates the primary timeline logic, section-to-section transitions, and ScrollTrigger updates. Supporting modules drive scene-specific systems: `switch-torus.js` powers the switch scene, `memory-flow-bg.js` and `memory-weave.js` handle the memory visuals, `closing-glitch.js` controls the closing state effects, and `narrative-overlay.js` manages the dialog overlay content and interactions.

Styling is split between `styles/variables.css` (design tokens and shared values) and `styles/styles.css` (layout, scene styling, animation states, and responsive behavior). The design intentionally uses high-contrast monochrome system aesthetics, dense grid motifs, and staged transitions to keep the metaphor readable while still feeling cinematic. A root redirect (`/index.html`) forwards directly to `/lost-in-the-scroll/` so the deployed site opens on the project experience.

## Links
- Live site: https://kailebsworld.github.io/scrollytelling-HOW-THE-SYSTEM-MOVES-kailebcardle/
- Repository: https://github.com/kailebsworld/scrollytelling-HOW-THE-SYSTEM-MOVES-kailebcardle
- Portfolio (optional): Add if applicable

## Tech Stack
- HTML5
- CSS3
- JavaScript (ES6+)
- GSAP 3
- GSAP ScrollTrigger
- Custom scroll-linked transition system (equivalent approach in place of ScrollSmoother)

## Reflection

### Metaphor Summary
This project frames learning JavaScript as entering a machine that never fully belongs to you. At first, the interface suggests control, but each section reveals that "control" is conditional: logic branches, state mutates, memory persists, and the system responds rather than obeys. By the end, the metaphor shifts from command to choreography, where success is not absolute dominance over code, but learning how to guide timing, structure, and interaction with intention.

### Section I'm Most Proud Of
I'm most proud of the transition corridor from the control scene through conditionals into the switch/memory handoff. That part required tightly coordinated scroll math, layered opacity changes, and position interpolation so each scene feels connected instead of isolated. The pacing now reads like one continuous thought, which supports the storytelling goal and makes the JS concepts feel like evolving states in the same system.

### One Technical Bug I Solved
A major bug appeared in the conditionals letter grid when the scripted "exit phrase" animation started: random mutation updates were still running and fought the phrase reveal, causing flicker and unstable characters. I solved it by gating the random scroll-mutation logic once phrase progress begins (`exitPhraseProgress > 0.01`) and routing updates through one controlled progress function. I also added pointer-state cleanup with `pointerup`/`pointercancel` to prevent stuck interaction states on touch devices.

### One Accessibility Decision I Made
I treated the side narrative labels as keyboard-usable controls by giving them `role="button"` and `tabindex="0"`, and I used semantic/assistive attributes in overlay components (`role="dialog"`, `aria-modal`, `aria-labelledby`) so the narrative panel is understandable to assistive technologies. Decorative visuals are marked with `aria-hidden="true"` so screen readers prioritize meaningful content.

### What I Would Improve With More Time
With more time, I would add a stronger reduced-motion mode that swaps complex transforms for simpler fades and static states, plus a more explicit focus-management system for overlay open/close behavior. I would also improve mobile performance by reducing heavy simultaneous effects in transition windows and profiling paint/reflow hotspots scene by scene.
