import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-rubik',
  imports: [CommonModule],
  templateUrl: './rubik.html',
  styleUrl: './rubik.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Rubik {
  timer = signal('Timer: 00:00');
  isSolved = signal(false);
  isStarted = signal(false);
  startTime = Date.now();
  timeInterval = setInterval(() => this.updateTimer(), 1000);

  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  controls!: OrbitControls;
  cubelets: THREE.Mesh[] = [];

  initializeCube() {
    this.isStarted.set(true);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const canvas = document.getElementById('rubikCanvas') as HTMLCanvasElement;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
    document.body.appendChild(this.renderer.domElement);

    const cubeSize = 3;
    const cubeletSize = 1;
    /* const cubelets = []; */

    const colors = [
      0xff0000, // Red
      0x00ff00, // Green
      0x0000ff, // Blue
      0xffff00, // Yellow
      0xffa500, // Orange
      0xffffff
    ];

    for (let x = 0; x < cubeSize; x++) {
      for (let y = 0; y < cubeSize; y++) {
        for (let z = 0; z < cubeSize; z++) {
          const geometry = new THREE.BoxGeometry(cubeletSize, cubeletSize, cubeletSize);
          const material = [
            new THREE.MeshBasicMaterial({ color: colors[0] }),
            new THREE.MeshBasicMaterial({ color: colors[1] }),
            new THREE.MeshBasicMaterial({ color: colors[2] }),
            new THREE.MeshBasicMaterial({ color: colors[3] }),
            new THREE.MeshBasicMaterial({ color: colors[4] }),
            new THREE.MeshBasicMaterial({ color: colors[5] })
          ];
          const cubelet = new THREE.Mesh(geometry, material);
          cubelet.position.set(x - 1, y - 1, z - 1);
          this.cubelets.push(cubelet);
          this.scene.add(cubelet);
        }
      }
    }

    this.camera.position.z = 5;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = false;

    this.randomRotations();

    this.animate();

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

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  rotateSide(axis, layer, direction) {
    const rotationAxis = new THREE.Vector3();
    rotationAxis[axis] = 1;
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationAxis(rotationAxis, (direction * Math.PI) / 2);

    this.cubelets.forEach((cubelet) => {
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
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.checkIfSolved();
  };

  updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    this.timer.set(`Timer: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
  }

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

  showWinnerMessage() {
    clearInterval(this.timeInterval);
    this.isSolved.set(true);
  }

  restartGame() {
    this.isSolved.set(false);
    this.timer.set('Timer: 00:00');
    this.startTime = Date.now();
    this.timeInterval = setInterval(() => this.updateTimer(), 1000);

    this.scene.children.length = 0;
    this.cubelets.length = 0;
    this.initializeCube();
  }
}
