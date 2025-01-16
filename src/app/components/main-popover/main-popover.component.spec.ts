import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPopoverComponent } from './main-popover.component';

describe('MainPopoverComponent', () => {
  let component: MainPopoverComponent;
  let fixture: ComponentFixture<MainPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPopoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
