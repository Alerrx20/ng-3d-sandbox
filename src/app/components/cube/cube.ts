import { ChangeDetectionStrategy, Component, OnInit, Signal, signal } from '@angular/core';

@Component({
  selector: 'app-cube',
  imports: [],
  templateUrl: './cube.html',
  styleUrl: './cube.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Cube implements OnInit {
  isDraggin = signal(false);
  startX!: Signal<number>;
  startY!: Signal<number>;
  currentX = signal(0);
  currentY = signal(0);

  ngOnInit() {
    const cube = document.querySelector('.cube') as HTMLElement;

    cube.addEventListener('mousedown', (event) => {
      this.isDraggin.set(true);
      this.startX = signal(event.clientX);
      this.startY = signal(event.clientY);
      cube.style.cursor = 'grabbing';
    });

    cube.addEventListener('mousemove', (event) => {
      if (this.isDraggin()) {
        const deltaX = event.clientX - this.startX();
        const deltaY = event.clientY - this.startY();
        this.currentX.update((x) => x + deltaX);
        this.currentY.update((y) => y - deltaY);
        cube.style.transform = `rotateX(${this.currentY()}deg) rotateY(${this.currentX()}deg)`;
        this.startX = signal(event.clientX);
        this.startY = signal(event.clientY);
      }
    });

    cube.addEventListener('mouseup', () => {
      this.isDraggin.set(false);
      cube.style.cursor = 'grab';
    });
  }
}
