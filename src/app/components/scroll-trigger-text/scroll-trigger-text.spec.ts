import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollTriggerText } from './scroll-trigger-text';

describe('ScrollTriggerText', () => {
  let component: ScrollTriggerText;
  let fixture: ComponentFixture<ScrollTriggerText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollTriggerText]
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollTriggerText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
