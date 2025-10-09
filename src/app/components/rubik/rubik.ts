import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-rubik',
  imports: [CommonModule],
  templateUrl: './rubik.html',
  styleUrl: './rubik.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Rubik implements OnInit {
  #time = signal(0);
  minutes = computed(() => Math.floor(this.#time() / 60000));
  seconds = computed(() => Math.floor((this.#time() % 60000) / 1000));
  milliseconds = computed(() => Math.floor((this.#time() % 1000) / 10));
  isSolved = signal(false);
  isStarted = signal(false);
  startTime = Date.now();
  timeInterval: any;

  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  controls!: OrbitControls;
  cubelets: THREE.Mesh[] = [];
  cubeGroup!: THREE.Group;

  cubieSize = 0.9;
  gap = 0.1;
  stickerSize = this.cubieSize * 0.88;
  stickerOffset = this.cubieSize / 2 + 0.001;

  #animationTime = 0;
  readonly #FLOAT_AMPLITUDE = 0.04; // Altura máxima del flotado
  readonly #FLOAT_SPEED = 0.03; // Velocidad de la oscilación

  ngOnInit(): void {
    this.initializeCube();
  }

  initializeCube() {
    this.scene = new THREE.Scene();

    const container = document.getElementById('scene-container');
    const { clientWidth, clientHeight } = container!;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(clientWidth, clientHeight);
    this.renderer.setClearColor(0x000000, 0);
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(85, clientWidth / clientHeight, 0.1, 1000);
    this.camera.position.set(1, 4, 4);
    this.camera.lookAt(0, 0, 0);

    // Luz ambiental
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // Activa el "damping" (amortiguación), que suaviza el movimiento de la cámara.
    // Sin esto, el movimiento sería instantáneo y menos natural.
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = false;
    // Desactiva el movimiento de paneo (traslación lateral/vertical de la cámara).
    // Solo se permitirá rotar la cámara alrededor del objetivo.
    this.controls.enablePan = false;

    this.createRubiksCube();
    this.animate();

    window.addEventListener('resize', () => {
      this.camera.aspect = clientWidth / clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(clientWidth, clientHeight);
    });
  }

  createRubiksCube() {
    this.cubeGroup = new THREE.Group();
    const positions = [-1, 0, 1];

    for (const i of positions) {
      for (const j of positions) {
        for (const k of positions) {
          if (i === 0 && j === 0 && k === 0) continue;
          const cubie = this.createCubie(i, j, k);
          this.cubeGroup.add(cubie);
        }
      }
    }

    // Aplicar una rotación inicial para que coincida con la vista isométrica de la imagen
    this.cubeGroup.rotation.x = -Math.PI * 1.06;
    this.cubeGroup.rotation.y = Math.PI * 0.99;

    this.scene.add(this.cubeGroup);
  }

  /**
   * Crea un solo cubie (cubo pequeño) usando el método de sticker sobre un core negro
   * para un borde negro limpio.
   */
  createCubie(xIndex, yIndex, zIndex) {
    const cubieGroup = new THREE.Group();

    const CUBE_COLORS = {
      // [0: White (W), 1: Red (R), 2: Blue (B), 3: Yellow (Y), 4: Orange (O), 5: Green (G)]
      OUTER_FACES: [0xffffff, 0xff0000, 0x0000ff, 0xffff00, 0xffa500, 0x00ff00],
      INNER_CORE: 0x1a1a1a // Black
    };

    // 1. Core Negro (El cuerpo del cubie, que crea el borde)
    const coreGeometry = new THREE.BoxGeometry(this.cubieSize, this.cubieSize, this.cubieSize);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: CUBE_COLORS.INNER_CORE,
      specular: 0x050505,
      shininess: 30
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);

    cubieGroup.add(coreMesh);

    // Stickers (Placas de color sobre el core)
    // [0: W, 1: R, 2: B, 3: Y, 4: O, 5: G]
    const stickerColors = CUBE_COLORS.OUTER_FACES;

    // Función auxiliar para crear la placa de color (sticker)
    function createSticker(color, width, height, depth, position) {
      const material = new THREE.MeshPhongMaterial({ color: color, specular: 0x050505, shininess: 30 });
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(position.x, position.y, position.z);
      return mesh;
    }

    // --- Añadir Stickers si la cara es exterior (xIndex, yIndex, zIndex != 0) ---

    // +X (Derecha) -> Rojo (R=1)
    if (xIndex === 1) {
      cubieGroup.add(
        createSticker(stickerColors[1], 0.01, this.stickerSize, this.stickerSize, { x: this.stickerOffset, y: 0, z: 0 })
      );
    }
    // -X (Izquierda) -> Naranja (O=4)
    else if (xIndex === -1) {
      cubieGroup.add(
        createSticker(stickerColors[4], 0.01, this.stickerSize, this.stickerSize, {
          x: -this.stickerOffset,
          y: 0,
          z: 0
        })
      );
    }

    // +Y (Arriba) -> Blanco (W=0)
    if (yIndex === 1) {
      cubieGroup.add(
        createSticker(stickerColors[0], this.stickerSize, 0.01, this.stickerSize, { x: 0, y: this.stickerOffset, z: 0 })
      );
    }
    // -Y (Abajo) -> Amarillo (Y=3)
    else if (yIndex === -1) {
      cubieGroup.add(
        createSticker(stickerColors[3], this.stickerSize, 0.01, this.stickerSize, {
          x: 0,
          y: -this.stickerOffset,
          z: 0
        })
      );
    }

    // +Z (Frontal) -> Azul (B=2)
    if (zIndex === 1) {
      cubieGroup.add(
        createSticker(stickerColors[2], this.stickerSize, this.stickerSize, 0.01, { x: 0, y: 0, z: this.stickerOffset })
      );
    }
    // -Z (Trasera) -> Verde (G=5)
    else if (zIndex === -1) {
      cubieGroup.add(
        createSticker(stickerColors[5], this.stickerSize, this.stickerSize, 0.01, {
          x: 0,
          y: 0,
          z: -this.stickerOffset
        })
      );
    }

    // Set the position of the entire cubie group (que incluye el core negro y los stickers)
    cubieGroup.position.set(
      xIndex * (this.cubieSize + this.gap),
      yIndex * (this.cubieSize + this.gap),
      zIndex * (this.cubieSize + this.gap)
    );

    return cubieGroup;
  }

  enableButtons() {
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowUp':
          this.rotateSide('y', 1, 1);
          break;
        case 'ArrowDown':
          this.rotateSide('y', -1, -1);
          break;
        case 'ArrowLeft':
          this.rotateSide('x', -1, -1);
          break;
        case 'ArrowRight':
          this.rotateSide('x', 1, 1);
          break;
        case 'w':
          this.rotateSide('z', -1, 1);
          break;
        case 's':
          this.rotateSide('z', 1, -1);
          break;
        case 'a':
          this.rotateSide('y', -1, 1);
          break;
        case 'd':
          this.rotateSide('y', 1, -1);
          break;
        case 'q':
          this.rotateSide('x', -1, 1);
          break;
        case 'e':
          this.rotateSide('x', 1, -1);
          break;
        case 'z':
          this.rotateSide('x', 0, 1);
          break;
        case 'x':
          this.rotateSide('x', 0, -1);
          break;
        case 'c':
          this.rotateSide('y', 0, 1);
          break;
        case 'v':
          this.rotateSide('y', 0, -1);
          break;
        case 'b':
          this.rotateSide('z', 0, 1);
          break;
        case 'n':
          this.rotateSide('z', 0, -1);
          break;
      }
    });
  }

  rotateSide(axis, layer, direction) {
    const rotationAxis = new THREE.Vector3();
    rotationAxis[axis] = 1;
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationAxis(rotationAxis, (direction * Math.PI) / 2);

    this.cubeGroup.children.forEach((cubelet) => {
      if (Math.round(cubelet.position[axis]) === layer) {
        cubelet.applyMatrix4(rotationMatrix);
        cubelet.position.round();
      }
    });
  }

  randomRotations() {
    const axes = ['x', 'y', 'z'];
    const layers = [-1, 0, 1];
    const directions = [-1, 1];

    for (let i = 0; i < 20; i++) {
      const axis = axes[Math.floor(Math.random() * axes.length)];
      const layer = layers[Math.floor(Math.random() * layers.length)];
      const direction = directions[Math.floor(Math.random() * directions.length)];
      this.rotateSide(axis, layer, direction);
    }
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    if (!this.isStarted()) {
      this.cubeGroup.rotation.y += 0.002;

      this.#animationTime += this.#FLOAT_SPEED;
      this.cubeGroup.position.y = Math.sin(this.#animationTime) * this.#FLOAT_AMPLITUDE;
    } else if (this.isStarted() && this.cubeGroup && this.cubeGroup.position.y !== 0) {
      this.cubeGroup.position.y = 0;
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.checkIfSolved();
  };

  checkIfSolved() {
    const solvedColors = [
      [0xff0000, 0xff0000, 0xff0000, 0xff0000, 0xff0000, 0xff0000, 0xff0000, 0xff0000],
      [0x00ff00, 0x00ff00, 0x00ff00, 0x00ff00, 0x00ff00, 0x00ff00, 0x00ff00, 0x00ff00],
      [0x0000ff, 0x0000ff, 0x0000ff, 0x0000ff, 0x0000ff, 0x0000ff, 0x0000ff, 0x0000ff],
      [0xffff00, 0xffff00, 0xffff00, 0xffff00, 0xffff00, 0xffff00, 0xffff00, 0xffff00],
      [0xffa500, 0xffa500, 0xffa500, 0xffa500, 0xffa500, 0xffa500, 0xffa500, 0xffa500],
      [0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff]
    ];

    const currentColors = this.cubelets.flatMap((cubelet) =>
      cubelet.material.map((material) => material.color.getHex())
    );

    for (let i = 0; i < solvedColors.length; i++) {
      if (!solvedColors[i].every((color, index) => color === currentColors[index])) {
        return;
      }
    }
  }

  startGame() {
    if (this.isStarted()) return;
    this.isStarted.set(true);
    if (this.controls) {
      this.controls.enabled = true;
    }
    this.enableButtons();
    this.startTimer();
  }

  startTimer() {
    this.stopTimer();
    this.startTime = Date.now();
    this.timeInterval = setInterval(() => {
      this.#time.set(this.#time() + 10);
    }, 10);
  }

  stopTimer() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  showWinnerMessage() {
    this.stopTimer();
    this.isSolved.set(true);
  }

  restartGame() {
    this.isSolved.set(false);
    this.isStarted.set(false);

    this.#time.set(0);
    this.startTime = Date.now();
    this.stopTimer();

    if (this.scene && this.cubeGroup) {
      this.scene.remove(this.cubeGroup);
    }
    this.scene.children.length = 0;
    this.cubelets.length = 0;

    this.camera.position.set(1, 4, 4);
    this.camera.lookAt(0, 0, 0);

    this.createRubiksCube();

    if (this.controls) {
      this.controls.enabled = false;
    }
  }
}
