// transactions.component.spec.ts
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TransactionsComponent } from './transactions.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TransactionsComponent', () => {
  let component: TransactionsComponent;
  let fixture: ComponentFixture<TransactionsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TransactionsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create the transactions component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch transactions on init', () => {
    const mockTransactions = [
      { id: 1, user_name: 'User1', from_currency: 'USD', from_currency_amount: '100', to_currency: 'EUR', to_currency_amount: '90', date: '2021-01-01' }
    ];

    component.ngOnInit();
    
    const req = httpMock.expectOne('http://localhost:8000/api/transactions/');
    req.flush(mockTransactions);

    expect(req.request.method).toBe('GET');
    expect(component.transactions.length).toBe(1);
    expect(component.transactions[0].user_name).toBe('User1');
  });

  it('should delete a transaction', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    const transactionId = 1;
    component.onDeleteTransaction(transactionId);
    
    const req = httpMock.expectOne(`http://localhost:8000/api/transactions/${transactionId}/`);
    req.flush({});
    
    expect(req.request.method).toBe('DELETE');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
