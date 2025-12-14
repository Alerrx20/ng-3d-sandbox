import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/all';
import _ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-scroll-trigger',
  imports: [],
  templateUrl: './scroll-trigger.html',
  styleUrl: './scroll-trigger.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollTrigger implements AfterViewInit {
  smoother: ScrollSmoother;

  ngAfterViewInit(): void {
    gsap.registerPlugin(_ScrollTrigger, ScrollSmoother);

    this.smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content'
    });
    const t1 = gsap.timeline({
      scrollTrigger: {
        trigger: '.animated-element',
        start: '50% center',
        end: '200% center',
        scrub: true,
        markers: true,
        toggleActions: 'play pause reverse reverse'
      }
    });

    t1.to('.animated-element', {
      x: 800
    });
  }
}
