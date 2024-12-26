// Import Three.js and loaders
import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { CatmullRomCurve3 } from './three.js-master/src/extras/curves/CatmullRomCurve3.js';

// Create a Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaec6cf); // Light sky blue

// Set up a Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 30);

// Set up Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 20, 10);
scene.add(directionalLight);

// Create a Floor (Land)
const floorGeometry = new THREE.PlaneGeometry(48, 50);
const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x22cb22 }); // Green grass
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.set(-30, 0, 0);
scene.add(floor);

// Create Underwater Section
const waterGeometry = new THREE.PlaneGeometry(108, 50);
const waterMaterial = new THREE.MeshLambertMaterial({ color: 0x1e90ff, transparent: true, opacity: 0.8 });
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI / 2;
water.position.y = -0.1;
scene.add(water);

// Create a Tree
const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5);
const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 }); // Brown trunk
const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
trunk.position.set(-10, 2.5, 0);
scene.add(trunk);

const foliageGeometry = new THREE.SphereGeometry(3, 16, 16);
const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 }); // Green foliage
const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
foliage.position.set(-10, 7, 0);
scene.add(foliage);

// Create an Electricity Cable
const cableGeometry = new THREE.CylinderGeometry(0.05, 0.05, 10);
const cableMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 }); // Black cable
const cable = new THREE.Mesh(cableGeometry, cableMaterial);
cable.rotation.x = Math.PI / 2;
cable.position.set(-25, 10, 5);
scene.add(cable);

const cablePostGeometry = new THREE.CylinderGeometry(0.1, 0.1, 12);
const cablePostMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 }); // Brown trunk
const cablePost1 = new THREE.Mesh(cablePostGeometry, cablePostMaterial);
cablePost1.position.set(-25, 6, 10);
scene.add(cablePost1);
const cablePost2 = new THREE.Mesh(cablePostGeometry, cablePostMaterial);
cablePost2.position.set(-25, 6, 0);
scene.add(cablePost2);

// Create a Ball
const ballGeometry = new THREE.SphereGeometry(2, 16, 16);
const ballMaterial = new THREE.MeshLambertMaterial({ color: 0xcb4543 });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(10, -0.5, 0);
scene.add(ball);

let angle = 0;

// Animation callbacks
const animateCallbacks = [];

// Helper function to check collision
function checkCollision(object, obstacles) {
  const objectBox = new THREE.Box3().setFromObject(object);
  for (const obstacle of obstacles) {
    const obstacleBox = new THREE.Box3().setFromObject(obstacle);
    if (objectBox.intersectsBox(obstacleBox)) {
      return true;
    }
  }
  return false;
}

// Store obstacles for collision detection
const obstacles = [trunk, foliage, cable, cablePost1, cablePost2];

// Load Zebra Model
const fbxLoader = new FBXLoader();
fbxLoader.load(
  './models/Zebra.fbx',
  (fbx) => {
    fbx.scale.set(1, 1, 1);
    fbx.position.set(-30, 2.5, 0);
    scene.add(fbx);

    const textureLoader = new THREE.TextureLoader();
    const zebraTexture = textureLoader.load('./textures/ZebraTexture.png');
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.material.map = zebraTexture;
      }
    });

    let t = 0;
    let jumpDirection = 1;
    let movingForward = true;
    const curve = new CatmullRomCurve3([
      new THREE.Vector3(-30, 2.5, 0),
      new THREE.Vector3(-20, 2.5, 10),
      new THREE.Vector3(-10, 2.5, 0),
      new THREE.Vector3(-20, 2.5, -10),
      new THREE.Vector3(-30, 2.5, 0),
    ]);

    function animateZebra() {
      t += movingForward ? 0.002 : -0.002;
      if (t > 1) {
        t = 1;
        movingForward = false;
        fbx.rotation.y = Math.PI; // Turn backward
      } else if (t < 0) {
        t = 0;
        movingForward = true;
        fbx.rotation.y = 0; // Turn forward
      }

      const position = curve.getPointAt(t);
      fbx.position.copy(position);

      fbx.position.y += 0.05 * jumpDirection;
      if (fbx.position.y > 5 || fbx.position.y < 2.5) {
        jumpDirection *= -1;
      }

      if (checkCollision(fbx, obstacles)) {
        fbx.position.copy(curve.getPointAt(t - (movingForward ? 0.002 : -0.002)));
      }
    }

    animateCallbacks.push(animateZebra);
  },
  undefined,
  (error) => {
    console.error('Error loading Zebra model:', error);
  }
);

// Load Giraffe Model
const objLoader = new OBJLoader();
objLoader.load(
  './models/Giraffe_Selcuk.obj',
  (object) => {
    object.scale.set(3, 3, 3);
    object.position.set(-20, 0, -5); // Daha yakın başlangıç pozisyonu

    const textureLoader = new THREE.TextureLoader();
    const giraffeTexture = textureLoader.load('./textures/giraffetexture.jpg');
    object.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({ map: giraffeTexture });
      }
    });

    let giraffeDirection = 1;
    let giraffeZ = -5; // Daha yakın başlangıç Z konumu
    let giraffeHeadAngle = 0;
    let walking = true;

    function animateGiraffe() {
      if (walking) {
        giraffeZ += 0.05 * giraffeDirection;
        object.position.z = giraffeZ;
        object.rotation.y = giraffeDirection > 0 ? 0 : Math.PI;

        if (giraffeZ > 5 || giraffeZ < -5) { // Yakın hareket sınırları
          giraffeDirection *= -1;
          walking = false;
        }
      } else {
        giraffeHeadAngle += 0.03;
        object.rotation.x = Math.sin(giraffeHeadAngle) * 0.2;
        if (giraffeHeadAngle > Math.PI * 2) {
          giraffeHeadAngle = 0;
          walking = true;
        }
      }
    }

    scene.add(object);
    animateCallbacks.push(animateGiraffe);
  },
  undefined,
  (error) => {
    console.error('Error loading Giraffe model:', error);
  }
);

// Load Horse Model and Add Jump Animation
objLoader.load(
  './models/Horse.obj',
  (horse) => {
    horse.scale.set(2, 2, 2);
    horse.position.set(0, 0, -10);
    scene.add(horse);

    const textureLoader = new THREE.TextureLoader();
    const horseTexture = textureLoader.load('./textures/horseTexture.jpg');
    horse.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({ map: horseTexture });
      }
    });

    let jumpHeight = 0;
    let jumpDirection = 1;

    function animateHorse() {
      jumpHeight += 0.05 * jumpDirection;
      horse.position.y = Math.sin(jumpHeight) * 2;

      if (jumpHeight > Math.PI || jumpHeight < 0) {
        jumpDirection *= -1;
      }
    }

    animateCallbacks.push(animateHorse);
  },
  undefined,
  (error) => {
    console.error('Error loading Horse model:', error);
  }
);

// Animation Loop
function animate() {
  angle += 0.03;
  ball.position.y = -0.5 + Math.cos(angle);

  animateCallbacks.forEach((callback) => callback());

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Resize Listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start Animation
animate();
