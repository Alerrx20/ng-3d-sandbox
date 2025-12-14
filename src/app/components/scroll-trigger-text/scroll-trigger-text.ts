import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-scroll-trigger-text',
  imports: [],
  templateUrl: './scroll-trigger-text.html',
  styleUrl: './scroll-trigger-text.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollTriggerText implements AfterViewInit {
  textElements!: HTMLElement[];

  ngAfterViewInit(): void {
    this.textElements = gsap.utils.toArray<HTMLElement>('.text');

    this.textElements.forEach((text) => {
      gsap.to(text, {
        backgroundSize: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: text,
          start: 'center 60%`',
          end: 'center 30%',
          scrub: true
          /* markers: true */
        }
      });
    });
  }
}
