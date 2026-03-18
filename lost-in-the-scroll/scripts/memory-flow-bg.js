import * as THREE from "https://unpkg.com/three@0.155.0/build/three.module.js";

const container = document.getElementById("memory-bg-3d");

if (container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const neonGreen = new THREE.Color("#00FF00");

  const group = new THREE.Group();
  scene.add(group);

  const vertexCount = window.matchMedia("(max-width: 768px)").matches ? 18 : 22;
  const lineCount = window.matchMedia("(max-width: 768px)").matches ? 120 : 175;

  const colorTemplate = [];
  for (let i = 0; i < vertexCount; i += 1) {
    const t = i / (vertexCount - 1);
    const brightness = 0.58 + 2.2 * Math.pow(1 - t, 0.4);
    const color = neonGreen.clone().multiplyScalar(brightness);

    colorTemplate.push(color.r, color.g, color.b);
  }

  const material = new THREE.LineBasicMaterial({
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    toneMapped: false
  });

  const lines = [];

  for (let i = 0; i < lineCount; i += 1) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(vertexCount * 3);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colorTemplate, 3));

    const line = new THREE.Line(geometry, material);
    line.userData.rnd = Math.random();
    group.add(line);
    lines.push(line);
  }

  function setPath(positionBuffer, t, i, rnd) {
    const time = t + rnd * 10 - i / 45;
    const x = (0.25 + 3.1 * rnd) * Math.sin(time + 13 * rnd) + 1.8 * rnd * Math.cos(3.1 * time + 3);
    const y = (2.9 - 2.7 * rnd) * Math.cos(time * 0.9) + 1.5 * rnd * Math.cos(4.4 * time - 7 * rnd);
    const z = 2.8 * rnd * rnd * Math.sin(2.65 * time - 4 * rnd);
    positionBuffer.setXYZ(i, x, y, z);
  }

  function onResize() {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(container);
  window.addEventListener("resize", onResize);

  function animationLoop(time) {
    const t = time / 3000;

    for (const line of lines) {
      const pos = line.geometry.getAttribute("position");
      for (let i = 0; i < vertexCount; i += 1) {
        setPath(pos, t, i, line.userData.rnd);
      }
      pos.needsUpdate = true;
    }

    group.rotation.z = t * 0.08;
    renderer.render(scene, camera);
  }

  onResize();
  renderer.setAnimationLoop(animationLoop);
}
