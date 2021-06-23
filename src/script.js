import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import dat from "dat.gui"

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector(".webgl")

// Textures
const textureLoader = new THREE.TextureLoader()

const planetAoTexture = textureLoader.load("/Textures/ground_0027_ao_2k.jpg")
const planetColorTexture = textureLoader.load(
  "/Textures/ground_0027_color_2k.jpg"
)
const planetEmessiveTexture = textureLoader.load(
  "/Textures/ground_0027_emissive_2k.jpg"
)
const planetHeightTexture = textureLoader.load(
  "/Textures/ground_0027_height_2k.jpg"
)
const planetNormalTexture = textureLoader.load(
  "/Textures/ground_0027_normal_2k.jpg"
)
const planetRoughnessTexture = textureLoader.load(
  "/Textures/ground_0027_roughness_2k.jpg"
)

// Scene
const scene = new THREE.Scene()

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Objests
// --- planet --
const planetGp = new THREE.Group()
scene.add(planetGp)
const planet = new THREE.Mesh(
  new THREE.SphereBufferGeometry(1, 100, 100),
  new THREE.MeshStandardMaterial()
)
planet.material.map = planetColorTexture
planet.material.aoMap = planetAoTexture
planet.material.displacementMap = planetHeightTexture
planet.material.normalMap = planetNormalTexture
planet.material.transparent = true
planet.material.roughnessMap = planetRoughnessTexture
planet.material.roughness = 2
planet.material.metalness = 0.1
planet.material.emissiveMap = planetEmessiveTexture
planet.material.emissiveIntensity = 1
planet.material.displacementScale = 0.3
planet.material.aoMapIntensity = 1

planet.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(planet.geometry.attributes.uv.array, 2)
)
// Debug -- planet
gui.add(planet.material, "aoMapIntensity").min(0.01).max(2).step(0.001)
gui.add(planet.material, "displacementScale").min(0.01).max(2).step(0.001)
gui.add(planet.material, "emissiveIntensity").min(0.01).max(1).step(0.001)
gui.add(planet.material, "metalness").min(0.01).max(2).step(0.001)
gui.add(planet.material, "roughness").min(0.01).max(2).step(0.001)
gui.add(planet.material, "wireframe")

planetGp.add(planet)

// --- particles --

const count = 200000
const position = new Float32Array(count * 3)
const color = new Float32Array(count * 3)
const particleGeometry = new THREE.BufferGeometry()
const innerRadius = 2.8
for (var i = 0; i < count; i++) {
  const i3 = i * 3
  position[i3] = Math.sin(i) * innerRadius * Math.random()
  position[i3 + 1] = Math.cos(i) * innerRadius * Math.random()
  position[i3 + 2] = 0

  color[i3] = Math.random()
  color[i3 + 1] = Math.random()
  color[i3 + 2] = Math.random()
}

particleGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(position, 3)
)
particleGeometry.setAttribute(
  "color",
  new THREE.Float32BufferAttribute(color, 3)
)
const particleMaterial = new THREE.PointsMaterial({
  size: 0.02,
  color: "#F98404",
  vertexColors: true,
  blending: THREE.AdditiveBlending,
})

const particles = new THREE.Points(particleGeometry, particleMaterial)
planetGp.add(particles)
planetGp.rotation.x = Math.PI / 4
// Helper
const axes = new THREE.AxesHelper(10)
// scene.add(axes)
// Lights
const ambientLight = new THREE.AmbientLight(0xffff00, 1.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5)
scene.add(directionalLight)

const pointLight = new THREE.PointLight(0xffffff, 0.7, 3)
scene.add(pointLight)

window.addEventListener("resize", () => {
  // Update Sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  // update Camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  // Update Renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
// Camera
const aspect = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100)
camera.position.set(1, 1, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera)

// Animate
const clock = new THREE.Clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  // Update Controls
  controls.update()

  // particles
  particles.rotation.z = elapsedTime / 7

  // Update Renderer
  renderer.render(scene, camera)

  //   Call func again
  window.requestAnimationFrame(tick)
}
tick()
