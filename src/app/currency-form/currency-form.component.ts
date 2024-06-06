// currency-form.component.ts

import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NbpApiResponse } from '../nbp-api-response.model';

interface Currency {
  currency: string;
  code: string;
}

@Component({
  selector: 'app-currency-form',
  templateUrl: './currency-form.component.html',
  styleUrls: ['./currency-form.component.css'],
})
export class CurrencyFormComponent implements OnInit {
  public currencies: Currency[] = [];
  @Output() currencySelected = new EventEmitter<string>();
  @ViewChild('amountInput') amountInput!: ElementRef;

  selectedCurrency: string | null = null;
  currentRate: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('CurrencyFormComponent initialized');
    this.fetchCurrencies();
    this.fetchCurrentRate();
  }

  fetchCurrencies() {
    const apiUrl = 'http://api.nbp.pl/api/exchangerates/tables/A/?format=json';

    this.http.get<NbpApiResponse[]>(apiUrl).subscribe((data) => {
      const rates = data[0].rates;
      this.currencies = rates.map((rate) => ({
        currency: rate.currency,
        code: rate.code,
      }));
    });
  }

  fetchCurrentRate() {
    if (this.selectedCurrency == null) {
      this.selectedCurrency = 'THB'; // domyślna waluta, jeśli nie wybrano
    }
    const apiUrl = `http://api.nbp.pl/api/exchangerates/rates/a/${this.selectedCurrency}/?format=json`;

    this.http.get<any>(apiUrl).subscribe(
      (data) => {
        this.currentRate = data.rates[0].mid;
        console.log(
          `Dzisiejszy kurs ${this.selectedCurrency}:`,
          this.currentRate
        );
      },
      (error) => {
        console.error(
          `Wystąpił błąd podczas pobierania kursu ${this.selectedCurrency}:`,
          error
        );
      }
    );
  }

  insertTransaction(amount: number) {
    const transactionData = {
      user_name: 'user',
      from_currency: 'PLN',
      from_currency_amount: amount,
      to_currency: this.selectedCurrency,
      to_currency_amount: this.calculateToCurrencyAmount(amount),
      date: new Date().toISOString() // generowanie bieżącej daty w odpowiednim formacie
    };

    this.http.post<any>(`http://localhost:8000/api/transactions/`, transactionData)
      .subscribe(
        response => {
          console.log('Transaction added successfully:', response);
          // Emitowanie zdarzenia, aby TransactionsComponent odświeżył dane
          const event = new CustomEvent('transactionAdded');
          window.dispatchEvent(event);
          this.amountInput.nativeElement.value = ''; // Wyczyść pole formularza
          // Możesz dodać tutaj obsługę, co się stanie po dodaniu transakcji
        },
        error => {
          console.error('Error adding transaction:', error);
          // Możesz dodać tutaj obsługę błędu
        }
      );
  }

  calculateToCurrencyAmount(amount: number): number {
    if (this.currentRate) {
      const result = amount / this.currentRate;
      return Number(result.toFixed(4));  
    }
    return 0;
  }

  onCurrencySelected(value: string): void {
    this.selectedCurrency = value;
    this.currencySelected.emit(value);
    console.log('form: ' + value);
    this.fetchCurrentRate();
  }

  onSubmit(amount: string): void {
    this.insertTransaction(parseFloat(amount));
  }
}
