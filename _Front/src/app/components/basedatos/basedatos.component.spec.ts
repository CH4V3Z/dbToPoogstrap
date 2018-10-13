import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasedatosComponent } from './basedatos.component';

describe('BasedatosComponent', () => {
  let component: BasedatosComponent;
  let fixture: ComponentFixture<BasedatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasedatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasedatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
