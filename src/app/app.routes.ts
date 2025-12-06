import { Route } from '@angular/router';
import { Cube } from './components/cube/cube';
import { Rubik } from './components/rubik/rubik';
import { AnimeAnimationScene } from './components/anime-animation-scene/anime-animation-scene';

export const appRoutes: Route[] = [
  { path: 'cube', component: Cube },
  { path: 'rubik', component: Rubik },
  { path: 'anime', component: AnimeAnimationScene }
];
