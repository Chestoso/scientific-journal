import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementVerificationComponent } from './requirement-verification.component';

describe('RequirementVerificationComponent', () => {
  let component: RequirementVerificationComponent;
  let fixture: ComponentFixture<RequirementVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequirementVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequirementVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
