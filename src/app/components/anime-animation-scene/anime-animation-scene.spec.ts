import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimeAnimationScene } from './anime-animation-scene';

describe('AnimeAnimationScene', () => {
  let component: AnimeAnimationScene;
  let fixture: ComponentFixture<AnimeAnimationScene>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimeAnimationScene]
    }).compileComponents();

    fixture = TestBed.createComponent(AnimeAnimationScene);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
