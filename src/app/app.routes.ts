import { Route } from '@angular/router';
import { Cube } from './components/cube/cube';
import { Rubik } from './components/rubik/rubik';

export const appRoutes: Route[] = [
  { path: 'cube', component: Cube },
  { path: 'rubik', component: Rubik }
];
