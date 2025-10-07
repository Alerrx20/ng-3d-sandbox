import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cube',
  imports: [],
  templateUrl: './cube.html',
  styleUrl: './cube.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cube {}
