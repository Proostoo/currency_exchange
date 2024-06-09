// currency-form.component.spec.ts
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CurrencyFormComponent } from './currency-form.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { NbpApiResponse } from '../nbp-api-response.model';

describe('CurrencyFormComponent', () => {
  let component: CurrencyFormComponent;
  let fixture: ComponentFixture<CurrencyFormComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CurrencyFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencyFormComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    component.amountInput = new ElementRef(document.createElement('input'));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch currencies on init', () => {
    const mockResponse: NbpApiResponse[] = [{
      table: 'A',
      currency: 'US Dollar',
      code: 'USD',
      rates: [{ no: '1', effectiveDate: '2021-01-01', mid: 3.8, currency: 'US Dollar', code: 'USD' }]
    }];

    component.ngOnInit();

    const req = httpMock.expectOne('http://api.nbp.pl/api/exchangerates/tables/A/?format=json');
    req.flush(mockResponse);

    expect(req.request.method).toBe('GET');
    expect(component.currencies.length).toBe(1);
    expect(component.currencies[0].code).toBe('USD');
  });

  it('should fetch current rate for selected currency', () => {
    const mockResponse = {
      table: 'A',
      currency: 'US Dollar',
      code: 'USD',
      rates: [{ no: '1', effectiveDate: '2021-01-01', mid: 3.8, currency: 'US Dollar', code: 'USD' }]
    };
    component.selectedCurrency = 'USD';

    component.fetchCurrentRate();

    const req = httpMock.expectOne(`http://api.nbp.pl/api/exchangerates/rates/a/USD/?format=json`);
    req.flush(mockResponse);

    expect(req.request.method).toBe('GET');
    expect(component.currentRate).toBe(3.8);
  });

  it('should insert a transaction', () => {
    const mockResponse = {};
    const amount = 100;
    component.selectedCurrency = 'USD';
    component.currentRate = 3.8;

    component.insertTransaction(amount);

    const req = httpMock.expectOne('http://localhost:8000/api/transactions/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.to_currency_amount).toBeCloseTo(26.3158, 4);
    req.flush(mockResponse);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
