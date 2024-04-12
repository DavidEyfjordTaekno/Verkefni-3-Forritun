import * as THREE from "https://cdn.skypack.dev/three@0.134.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.134.0/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.134.0/examples/jsm/loaders/GLTFLoader.js";

// create scene
const scene = new THREE.Scene();

// create and set camera
const camera = new THREE.PerspectiveCamera(
    35,
    innerWidth / innerHeight,
    0.1,
    1100
);
camera.position.setZ(88);
camera.position.setY(55);
camera.position.setX(66);
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

// create and set renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: document.getElementById("canvas"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 0);

//add ambient light
const ambientLight = new THREE.AmbientLight(0xfffffff);
ambientLight.intensity = 1.2;
scene.add(ambientLight);

// add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
scene.add(directionalLight);
directionalLight.position.set(-20, 1, -20);

// import 3d models
let mixer, action;
let loader = new GLTFLoader();
loader.load("animated_triceratops_skeleton.glb", function (gltf) {
    let model = gltf.scene;
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    action = mixer.clipAction(gltf.animations[2]);
    action.play();

    model.scale.set(11, 11, 11);
    model.position.y = 9;
    model.position.x = -20;
});

loader.load("Skyr.glb", function (gltf) {
    let model = gltf.scene;
    scene.add(model);

    model.scale.set(77, 77, 77);
    model.position.y = 0;
    model.position.x = 20;
});

// add orbit controls
let controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;

// load texture
const texture = new THREE.TextureLoader().load("texture.jpg");
texture.repeat.set(1.5, 2);
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;

// Load normal map
const normalMap = new THREE.TextureLoader().load("NormalMap.png");
normalMap.repeat.set(1.5, 1);
normalMap.wrapS = THREE.RepeatWrapping;
normalMap.wrapT = THREE.RepeatWrapping;

// add plane floor
const planeMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    normalMap: normalMap,
    roughness: 1.0,
    normalScale: new THREE.Vector2(0.4, 0.4),
});
const planeGeometry = new THREE.PlaneGeometry(40, 66);

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -Math.PI / 2;
plane.position.set(-20, 0, -10);

// make it responsive
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// add clock for animations
const clock = new THREE.Clock();

// update frame
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (mixer) mixer.update(clock.getDelta());
    controls.update();
}
animate();
