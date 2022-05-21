import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { ShaderPass } from "./../node_modules/three/examples/jsm/postprocessing/ShaderPass";

import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { RGBShiftShader } from "./../node_modules/three/examples/jsm/shaders/RGBShiftShader";

import * as dat from 'dat.gui'
import GLTFLoader from 'three-gltf-loader';
import gsap from 'gsap'
const gltfLoader = new GLTFLoader()

// Debug
const gui = new dat.GUI()

let ambientLight,
		pointLight

let mouse = {
	x: 0,
	y: 0
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

let tl = gsap.timeline()

gltfLoader.load('scene.gltf', (gltf) => {

  gltf.scene.scale.set(0.4,0.4,0.4)
	gltf.scene.rotation.y = 5
  //gltf.scene.center()
  scene.add(gltf.scene)

  gui.add(gltf.scene.rotation, 'x').min(0).max(9)
  gui.add(gltf.scene.rotation, 'y').min(0).max(9)
  gui.add(gltf.scene.rotation, 'z').min(0).max(9)
})

const geometry = new THREE.BufferGeometry();
const vertices = []

const sprite = new THREE.TextureLoader().load( 'old.png' )

for ( let i = 0; i < 10000; i ++ ) {

					const x = 2000 * Math.random() - 1000;
					const y = 2000 * Math.random() - 1000;
					const z = 2000 * Math.random() - 1000;

					vertices.push( x, y, z );
}

geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

const material = new THREE.PointsMaterial( { size: 35, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true } );
material.color.setHSL( 1.0, 0.3, 0.7 );

const particles = new THREE.Points( geometry, material );
scene.add( particles );

// Lights

// Ambient light
	ambientLight = new THREE.AmbientLight(0xff0000, 0.051);
	scene.add(ambientLight);

	// Point light
	pointLight = new THREE.PointLight(0x99ccff, 0.5);
	pointLight.position.set(40, 40, 40);
	pointLight.castShadow = true;
	pointLight.shadow.bias = 5.1;
	pointLight.mapSizeWidth = 2048; // Shadow Quality
	pointLight.mapSizeHeight = 2048; // Shadow Quality
	scene.add(pointLight);



const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

document.addEventListener('mousemove', onMouseMove, false);

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10)
camera.position.x = -1.6
camera.position.y = 0.5
camera.position.z = 1.6
scene.add(camera)


 // Renderer

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


function onMouseMove(event) {
	event.preventDefault();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	let vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
	vector.unproject(camera);
	let dir = vector.sub(camera.position).normalize();
	let distance = -camera.position.z / dir.z;
	let pos = camera.position.clone().add(dir.multiplyScalar(distance));
	pointLight.position.copy(pos);
};

const renderScene = new RenderPass(scene, camera)

//Bloom
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.exposure = 0.6
bloomPass.threshold = 0.0;
bloomPass.strength = 0.5; //intensity of glow
bloomPass.radius = 0.6;

const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);
composer.renderToScreen = true;
composer.addPass(renderScene);
composer.addPass(bloomPass)

const effect2 = new ShaderPass( RGBShiftShader );
effect2.uniforms[ 'amount' ].value = 0.0015;
composer.addPass( effect2 );


/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects

    //.rotation.y += 0.5

    // Update Orbital Controls
    // controls.update()

    // Render
  	composer.render(scene, camera)
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
