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

function createGrassFloor(scene) {
  // Texture Loader
  const textureLoader = new THREE.TextureLoader();

  // Load grass texture from the specified path
  const grassTexture = textureLoader.load('./three.js-master/examples/textures/terrain/grasslight-big.jpg');

  // Set texture properties for wrapping and repeating
  grassTexture.wrapS = THREE.RepeatWrapping;
  grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(10, 10); // Repeat the texture 10x10

  // Create the geometry and material
  const floorGeometry = new THREE.PlaneGeometry(48, 50); // Size of the floor
  const floorMaterial = new THREE.MeshLambertMaterial({
    map: grassTexture, // Apply the grass texture
  });

  // Create the floor mesh
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);

  // Set the rotation and position
  floor.rotation.x = -Math.PI / 2; // Rotate to make it horizontal
  floor.position.set(-30, 0, 0); // Position the floor

  // Add to the scene
  scene.add(floor);
}

// Create grass floor and add it to the scene
createGrassFloor(scene);



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
    let jumpActive = false;
    const curve = new CatmullRomCurve3([
      new THREE.Vector3(-30, 2.5, 0),
      new THREE.Vector3(-25, 2.5, 5),
      new THREE.Vector3(-20, 2.5, 0),
      new THREE.Vector3(-25, 2.5, -5),
      new THREE.Vector3(-30, 2.5, 0),
    ]);

    function animateZebra() {
      if (!jumpActive) {
        t += 0.001; // Slower moving
        if (t > 1) t = 0;

        const position = curve.getPointAt(t);
        fbx.position.copy(position);
      }
    }

    function jumpZebra() {
      if (!jumpActive) {
        jumpActive = true;
        let jumpHeight = 0;
        let jumpDirection = 1;

        function performJump() {
          jumpHeight += 0.10 * jumpDirection;
          fbx.position.y = 2.5 + Math.sin(jumpHeight) * 1.5;

          if (jumpHeight > Math.PI) {
            jumpDirection = -1;
          } else if (jumpHeight < 0) {
            jumpActive = false;
            fbx.position.y = 2.5; // Back to the floor
            animateCallbacks.splice(animateCallbacks.indexOf(performJump), 1);
          }
        }

        animateCallbacks.push(performJump);
      }
    }

    window.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        jumpZebra();
      }
    });

    animateCallbacks.push(animateZebra);
  },
  undefined,
  (error) => {
    console.error('Error loading Zebra model:', error);
  }
);

// Load Giraffe Model
let giraffe;
let giraffeAnimating = true;
const objLoader = new OBJLoader();
objLoader.load(
  './models/Giraffe_Selcuk.obj',
  (object) => {
    giraffe = object;
    giraffe.scale.set(3, 3, 3);
    giraffe.position.set(-20, 0, -5);

    const textureLoader = new THREE.TextureLoader();
    const giraffeTexture = textureLoader.load('./textures/giraffetexture.jpg');
    giraffe.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({ map: giraffeTexture });
      }
    });

    let giraffeDirection = 1;
    let giraffeZ = -5;

    function animateGiraffe() {
      if (giraffeAnimating) {
        giraffeZ += 0.05 * giraffeDirection;
        giraffe.position.z = giraffeZ;
        giraffe.rotation.y = giraffeDirection > 0 ? 0 : Math.PI;

        if (giraffeZ > 5 || giraffeZ < -5) {
          giraffeDirection *= -1;
        }
      }
    }

    giraffe.userData.animateGiraffe = animateGiraffe;
    animateCallbacks.push(animateGiraffe);

    giraffe.userData.rotateGiraffe = () => {
      giraffeAnimating = false;
      let rotationAngle = 0;
      const rotationSpeed = 0.02;

      function animateRotation() {
        rotationAngle += rotationSpeed;
        giraffe.rotation.y += rotationSpeed;

        if (rotationAngle >= Math.PI * 2) {
          animateCallbacks.splice(animateCallbacks.indexOf(animateRotation), 1);
          giraffeAnimating = true;
        }
      }

      animateCallbacks.push(animateRotation);
    };

    scene.add(giraffe);
  },
  undefined,
  (error) => {
    console.error('Error loading Giraffe model:', error);
  }
);

// Load Zebra Model and Add Jump Animation
let zebra;
objLoader.load(
  './models/Zebra.obj',
  (object) => {
    zebra = object;
    zebra.scale.set(2, 2, 2);
    zebra.position.set(0, 0, -10);
    scene.add(zebra);

    const textureLoader = new THREE.TextureLoader();
    const zebraTexture = textureLoader.load('./textures/zebraTexture.jpg');
    zebra.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({ map: zebraTexture });
      }
    });

    let zebraZ = -10;
    let zebraDirection = 1;
    let zebraSpeed = 0.02; 
    let jumpActive = false;

    function animateZebra() {
      zebraZ += zebraSpeed * zebraDirection;
      zebra.position.z = zebraZ;

      if (zebraZ > -5 || zebraZ < -15) {
        zebraDirection *= -1;
      }
    }

    function jumpZebra() {
      if (!jumpActive) {
        jumpActive = true;
        let jumpHeight = 0;
        let jumpDirection = 1;

        function performJump() {
          jumpHeight += 0.15 * jumpDirection;
          zebra.position.y = Math.sin(jumpHeight) * 2 + 1; 

          if (jumpHeight > Math.PI) {
            jumpDirection = -1;
          } else if (jumpHeight < 0) {
            jumpDirection = 1;
            zebra.position.y = 1;
            animateCallbacks.splice(animateCallbacks.indexOf(performJump), 1);
            jumpActive = false;
          }
        }

        animateCallbacks.push(performJump);
      }
    }

    window.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        jumpZebra();
      }
    });

    animateCallbacks.push(animateZebra);
  },
  undefined,
  (error) => {
    console.error('Error loading Zebra model:', error);
  }
);


// Add Event Listeners
window.addEventListener('click', (event) => {
  if (giraffe && giraffe.userData.rotateGiraffe) {
    giraffe.userData.rotateGiraffe();
  }
});

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