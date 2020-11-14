import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkBuilderModalComponent } from './link-builder-modal.component';

describe('LinkBuilderModalComponent', () => {
  let component: LinkBuilderModalComponent;
  let fixture: ComponentFixture<LinkBuilderModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkBuilderModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkBuilderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
