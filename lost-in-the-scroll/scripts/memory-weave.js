document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("memory-word-wave");
  if (!wrapper) {
    return;
  }

  const makeInstance = (word, amount, offset) => {
    const templateElement = document.createElement("p");
    templateElement.classList.add("memory-word-template");
    templateElement.textContent = word;
    wrapper.appendChild(templateElement);

    for (let i = 0; i < amount; i += 1) {
      const wordElement = document.createElement("p");
      wordElement.classList.add("memory-word-instance");
      wordElement.style.animationDelay = `${offset * i}s`;
      wordElement.textContent = word;
      wrapper.appendChild(wordElement);
    }
  };

  makeInstance("MEMORY", 16, 0.06);
});
