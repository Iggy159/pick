import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import GLTFLoader from 'three-gltf-loader';
import gsap from 'gsap'
const gltfLoader = new GLTFLoader()

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

let tl = gsap.timeline()

gltfLoader.load('sedanSports.glb', (gltf) => {

  gltf.scene.scale.set(0.4,0.4,0.4)
  gltf.scene.rotation.set(0.86,2.4,0)
  scene.add(gltf.scene)

  tl

  gui.add(gltf.scene.rotation, 'x').min(0).max(9)
  gui.add(gltf.scene.rotation, 'y').min(0).max(9)
  gui.add(gltf.scene.rotation, 'z').min(0).max(9)
})

// Lights

const pointLight = new THREE.PointLight(0xffffff, 4)
pointLight.position.x = 5
pointLight.position.y = 8
pointLight.position.z = 4
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xff0000, 0.3)
pointLight2.position.x = -5
pointLight2.position.y = -8
pointLight2.position.z = 4
scene.add(pointLight2)
/**
 * Sizes
 */

//control
// const keyPressed = {}
// document.addEventListener('keydown', (event) => {
//     (keyPressed as any)[event.key.toLowerCase()] = true
// }, false)

// document.addEventListener('keyup', (event) => {

// }, false)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 4
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects

    //.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
