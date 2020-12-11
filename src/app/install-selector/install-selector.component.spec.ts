import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallSelectorComponent } from './install-selector.component';

describe('InstallSelectorComponent', () => {
  let component: InstallSelectorComponent;
  let fixture: ComponentFixture<InstallSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstallSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
