import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandSelectorModalComponent } from './land-selector-modal.component';

describe('LandSelectorModalComponent', () => {
  let component: LandSelectorModalComponent;
  let fixture: ComponentFixture<LandSelectorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandSelectorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandSelectorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
