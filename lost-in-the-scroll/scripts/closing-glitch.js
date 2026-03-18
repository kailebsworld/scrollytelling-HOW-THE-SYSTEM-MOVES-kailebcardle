document.addEventListener("DOMContentLoaded", () => {
  const text = document.getElementById("closing-transitioned-text");
  if (!text) {
    return;
  }

  const originalText = "I don't control it fully, but I can choreograph it.";
  const controlPhrase = "I HAVE CONTROL";
  const switchToText = controlPhrase;
  const resolvedText = controlPhrase;
  const scrambledCharacters = '(.__?/\\_,#>["__-$-~+}]__@<^__"=*!{>.)0123456789';

  let animationFrameId = 0;
  let mode = "text";

  const randomCharacter = () =>
    scrambledCharacters[Math.floor(Math.random() * scrambledCharacters.length)];

  const scrambleTo = (targetText) => {
    cancelAnimationFrame(animationFrameId);

    const initialText = text.textContent || "";
    const maxTextLength = Math.max(initialText.length, targetText.length);
    const characterQueue = [];
    let frame = 0;

    for (let i = 0; i < maxTextLength; i += 1) {
      const originalCharacter = initialText[i] || "";
      const targetCharacter = targetText[i] || "";
      const start = Math.floor(Math.random() * 18);
      const end = start + 24 + Math.floor(Math.random() * 44);

      characterQueue.push({
        original: originalCharacter,
        target: targetCharacter,
        start,
        end,
        scrambled: ""
      });
    }

    const updateAnimation = () => {
      let outputText = "";
      let completedCharacters = 0;

      for (const characterData of characterQueue) {
        const { original, target, start, end, scrambled } = characterData;

        if (frame >= end) {
          completedCharacters += 1;
          outputText += target;
        } else if (frame >= start) {
          const shouldScramble = !scrambled || Math.random() < 0.32;
          const scrambledChar = shouldScramble ? randomCharacter() : scrambled;
          characterData.scrambled = scrambledChar;
          outputText += `<span class="dud">${scrambledChar}</span>`;
        } else {
          outputText += original;
        }
      }

      text.innerHTML = outputText;

      if (completedCharacters < characterQueue.length) {
        frame += 1;
        animationFrameId = requestAnimationFrame(updateAnimation);
      }
    };

    updateAnimation();
  };

  const setMode = (nextMode) => {
    if (nextMode === mode) {
      return;
    }

    mode = nextMode;
    if (nextMode === "binary") {
      text.classList.remove("resolved-text");
      text.classList.add("glitched-text");
      scrambleTo(switchToText);
    } else if (nextMode === "resolved") {
      text.classList.remove("glitched-text");
      text.classList.add("resolved-text");
      scrambleTo(resolvedText);
    } else {
      text.classList.remove("glitched-text");
      text.classList.remove("resolved-text");
      scrambleTo(originalText);
    }
  };

  const resolveNow = () => {
    cancelAnimationFrame(animationFrameId);
    mode = "resolved";
    text.classList.remove("glitched-text");
    text.classList.add("resolved-text");
    text.textContent = resolvedText;
  };

  const setProgress = (progress) => {
    const p = Math.max(0, Math.min(1, progress));
    text.style.setProperty("--glitch-intensity", p.toFixed(3));

    if (p > 0.9) {
      resolveNow();
      return;
    }

    if (p > 0.7) {
      setMode("resolved");
    } else if (p > 0.36) {
      setMode("binary");
    } else if (p < 0.28) {
      setMode("text");
    }
  };

  text.textContent = originalText;
  window.closingGlitchControls = {
    setMode,
    setProgress
  };
});
