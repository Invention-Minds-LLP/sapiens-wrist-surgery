import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WristSurgeryPage } from './wrist-surgery-page';

describe('WristSurgeryPage', () => {
  let component: WristSurgeryPage;
  let fixture: ComponentFixture<WristSurgeryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WristSurgeryPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WristSurgeryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
