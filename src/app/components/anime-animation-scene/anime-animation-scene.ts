import { isPlatformBrowser, UpperCasePipe, CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  PLATFORM_ID,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
  OnDestroy
} from '@angular/core';
import { gsap } from 'gsap';
import { animeScenes } from '../../data';
import { AnimeSceneEntry } from '../../model';

@Component({
  selector: 'app-anime-animation-scene',
  imports: [CommonModule, UpperCasePipe],
  templateUrl: './anime-animation-scene.html',
  styleUrl: './anime-animation-scene.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimeAnimationScene implements AfterViewInit, OnDestroy {
  @ViewChildren('titleRef', { read: ElementRef })
  titles!: QueryList<ElementRef>;

  @ViewChildren('boxRef', { read: ElementRef })
  boxes!: QueryList<ElementRef>;

  @ViewChild('gifRef', { read: ElementRef }) gifRef!: ElementRef;

  sceneElements: {
    sceneName: string;
    titleRef: HTMLElement;
    boxRefs: HTMLElement[];
    timeline: gsap.core.Timeline;
  }[] = [];

  #platformId = inject(PLATFORM_ID);
  gifUrls = signal<{ [scene: string]: string }>({});

  scenesEntries = Object.entries(animeScenes);

  hoverTimelines: Record<string, gsap.core.Timeline> = {};

  private boundResize = this.onResize.bind(this);

  // -----------------------------
  // HELPERS
  // -----------------------------

  private responsiveScale(value: number | { desktop: number; tablet: number; mobile: number }): number {
    if (typeof value === 'number') return value;

    const width = window.innerWidth;
    if (width < 700) return value.mobile;
    if (width < 1024) return value.tablet;
    return value.desktop;
  }

  private getTitleCenterOffset(title: HTMLElement): number {
    const rect = title.getBoundingClientRect();
    const parentRect = title.parentElement!.getBoundingClientRect();
    return rect.left - parentRect.left + rect.width / 2;
  }

  private setInitialBoxState(box: HTMLElement, config: AnimeSceneEntry | any) {
    gsap.set(box, {
      x: this.responsiveScale(config.offsetX),
      y: this.responsiveScale(config.offsetY),
      rotate: config.rotate,
      opacity: 0
    });
  }

  private applyFinalBoxPosition(box: HTMLElement, config: AnimeSceneEntry | any, titleCenter: number) {
    gsap.set(box, {
      x: this.responsiveScale(config.offsetX),
      y: this.responsiveScale(config.offsetY),
      rotate: config.rotate
    });
  }

  private createHoverTimeline(title: HTMLElement, boxes: HTMLElement[]): gsap.core.Timeline {
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

    boxes.forEach((box) => {
      tl.fromTo(box, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.45 }, 'start');
    });

    tl.add(() => title.classList.add('active-color'), 'start');

    tl.to(
      title,
      {
        duration: 0.45,
        color: 'transparent'
      },
      'start'
    );

    return tl;
  }

  // -----------------------------
  // NG AFTER VIEW INIT
  // -----------------------------

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.#platformId) || !gsap) return;

    this.buildScenes();
    window.addEventListener('resize', this.boundResize);
  }

  private buildScenes() {
    this.sceneElements = [];
    this.hoverTimelines = {};
    let boxIndex = 0;

    this.scenesEntries.forEach(([sceneName, configs], titleIndex) => {
      const title = this.titles.get(titleIndex)?.nativeElement;
      if (!title) {
        boxIndex += configs.length;
        return;
      }

      const boxes: HTMLElement[] = [];

      configs.forEach((config: any, i: number) => {
        const box = this.boxes.get(boxIndex + i)?.nativeElement;
        if (box) {
          boxes.push(box);
          this.setInitialBoxState(box, config);
        }
      });

      const timeline = this.createHoverTimeline(title, boxes);
      this.hoverTimelines[sceneName] = timeline;

      this.sceneElements.push({ sceneName, titleRef: title, boxRefs: boxes, timeline });
      boxIndex += configs.length;
    });
  }

  // -----------------------------
  // EVENTS
  // -----------------------------

  onMouseEnter(scene: string): void {
    const entry = this.sceneElements.find((s) => s.sceneName === scene);
    if (!entry) return;

    entry.titleRef.classList.add('active-color');

    const titleCenter = this.getTitleCenterOffset(entry.titleRef);
    const configs = animeScenes[scene];

    entry.boxRefs.forEach((box, i) => {
      this.applyFinalBoxPosition(box, configs[i], titleCenter);
    });

    entry.timeline.timeScale(1).play();
  }

  onMouseLeave(scene: string): void {
    const entry = this.sceneElements.find((s) => s.sceneName === scene);
    if (!entry) return;

    entry.timeline.timeScale(1.5).reverse();

    entry.timeline.eventCallback('onReverseComplete', () => {
      entry!.titleRef.classList.remove('active-color');
    });

    entry.boxRefs.forEach((box) => {
      gsap.to(box, { rotate: 0, duration: 0.3, ease: 'power1.out' });
    });
  }

  // -----------------------------
  // RESIZE HANDLER
  // -----------------------------

  private onResize() {
    this.sceneElements.forEach((entry) => {
      const configs = animeScenes[entry.sceneName];
      entry.boxRefs.forEach((box, i) => {
        this.setInitialBoxState(box, configs[i]);
      });
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.boundResize);
  }
}
