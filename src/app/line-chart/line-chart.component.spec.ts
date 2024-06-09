// line-chart.component.spec.ts
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LineChartComponent } from './line-chart.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NbpApiResponse } from '../nbp-api-response.model';

describe('LineChartComponent', () => {
  let component: LineChartComponent;
  let fixture: ComponentFixture<LineChartComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LineChartComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create the line chart component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch currency rates and create chart', () => {
    component.selectedCurrency = 'USD';
    component.selectedRange = { label: 'Last 7 days', days: 7 };

    const mockResponse: NbpApiResponse = {
      table: 'A',
      currency: 'US Dollar',
      code: 'USD',
      rates: [
        { no: '1', effectiveDate: '2021-01-01', mid: 3.8, currency: 'US Dollar', code: 'USD' },
        { no: '2', effectiveDate: '2021-01-02', mid: 3.9, currency: 'US Dollar', code: 'USD' }
      ]
    };

    component.fetchCurrencyRatesAndCreateChart();
    
    const req = httpMock.expectOne(`http://api.nbp.pl/api/exchangerates/rates/a/USD/last/7/?format=json`);
    req.flush(mockResponse);

    expect(req.request.method).toBe('GET');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
