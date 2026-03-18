import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.module.js";

const container = document.getElementById("switch-kinetic");

if (!container) {
  // Nothing to render when the switch stage is not mounted.
}

if (container) {
  const clamp01 = (value) => Math.max(0, Math.min(1, value));
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;

      vUv = uv;
      vPosition = position;
    }
  `;

  // Derived from the torus-knot fragment approach in the reference code.
  const fragmentShader = `
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform float uVelocity;
    uniform float uShadow;

    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vec2 repeat = vec2(12.0, 3.0);
      vec2 repeatedUv = vUv * repeat;
      vec2 displacement = vec2(uTime * uVelocity, 0.0);
      vec2 uv = fract(repeatedUv + displacement);
      vec3 textureColor = texture2D(uTexture, uv).rgb;
      float shadow = clamp((vPosition.z / uShadow) + 0.35, 0.0, 1.0);
      vec3 color = textureColor * shadow;
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 140);
  camera.position.set(0, 0, 40);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setClearAlpha(0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.LinearEncoding;
  container.appendChild(renderer.domElement);

  const textTexture = createTextTexture();
  textTexture.wrapS = THREE.RepeatWrapping;
  textTexture.wrapT = THREE.RepeatWrapping;
  textTexture.anisotropy = 8;
  textTexture.needsUpdate = true;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uVelocity: { value: 0.32 },
      uShadow: { value: 7.5 },
      uTexture: { value: textTexture }
    },
    vertexShader,
    fragmentShader
  });

  const geometry = new THREE.TorusKnotGeometry(9, 3, 768, 3, 4, 3);
  const torus = new THREE.Mesh(geometry, material);
  torus.rotation.set(0.22, -0.1, 0);
  scene.add(torus);

  const clock = new THREE.Clock();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let invertActive = false;
  let diveProgress = 0;

  const setInversion = (nextState) => {
    if (invertActive === nextState) {
      return;
    }
    invertActive = nextState;
    document.body.classList.toggle("torus-invert", invertActive);
  };

  const pointHitsTorus = (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return false;
    }
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObject(torus, false).length > 0;
  };

  renderer.domElement.addEventListener("click", (event) => {
    if (!pointHitsTorus(event)) {
      return;
    }
    setInversion(!invertActive);
  });

  window.switchTorusControls = {
    setDiveProgress(nextValue) {
      diveProgress = clamp01(nextValue);
    },
    toggleInvert() {
      setInversion(!invertActive);
    }
  };

  function onResize() {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function animate() {
    material.uniforms.uTime.value = clock.getElapsedTime();
    const targetZ = THREE.MathUtils.lerp(40, 5.8, diveProgress);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.12);
    torus.scale.setScalar(1);
    torus.rotation.x = 0.22;
    torus.rotation.y = -0.1;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  onResize();
  window.addEventListener("resize", onResize);
  animate();
}

function createTextTexture() {
  const size = 2048;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);

  const lines = ["THE SWITCH - THE SWITCH - THE SWITCH - ", "CONDITIONALS + classList.toggle() - "];

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  for (let row = 0; row < 10; row += 1) {
    const y = 180 + row * 195;
    const line = lines[row % lines.length];
    ctx.font = row % 2 === 0 ? "700 126px 'Open Sans', Arial, sans-serif" : "700 94px 'Open Sans', Arial, sans-serif";
    ctx.fillStyle = row % 2 === 0 ? "#f7f7f7" : "#c8c8c8";

    const textWidth = ctx.measureText(line).width;
    let x = row % 2 === 0 ? -240 : -120;
    while (x < size + 240) {
      ctx.fillText(line, x, y);
      x += textWidth + 80;
    }
  }

  return new THREE.CanvasTexture(canvas);
}
