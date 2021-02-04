import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulateStockDataComponent } from './simulate-stock-data.component';

describe('SimulateStockDataComponent', () => {
  let component: SimulateStockDataComponent;
  let fixture: ComponentFixture<SimulateStockDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulateStockDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulateStockDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
