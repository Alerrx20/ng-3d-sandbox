import { AfterViewInit, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from './components/header/header';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  imports: [RouterModule, Header],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
  smoother: ScrollSmoother;

  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    this.smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content'
    });
  }
}
