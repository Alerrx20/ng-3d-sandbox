import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollTrigger } from './scroll-trigger';

describe('ScrollTrigger', () => {
  let component: ScrollTrigger;
  let fixture: ComponentFixture<ScrollTrigger>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollTrigger]
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollTrigger);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
