// app.component.spec.ts
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let modalService: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule for HttpClient
      providers: [
        {
          provide: NgbModal,
          useValue: {
            open: jasmine.createSpy('open').and.returnValue({
              componentInstance: {},
              result: Promise.resolve(true),
              close: () => {},
              dismiss: () => {}
            } as NgbModalRef)
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(NgbModal);
    fixture.detectChanges();
  });

  it('powinien utworzyć komponent aplikacji', () => {
    expect(component).toBeTruthy();
  });

  it('powinien otworzyć modal', () => {
    const modalInstance = modalService.open({});
    expect(modalInstance).toBeDefined();
  });

  it('powinien ustawić selectedCurrency na podaną wartość', () => {
    const currency = 'USD';
    component.onCurrencySelected(currency);

    expect(component.selectedCurrency).toBe(currency);
  });
});
