// transactions.component.ts

import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Transaction {
  id: number;
  user_name: string;
  from_currency: string;
  from_currency_amount: string;
  to_currency: string;
  to_currency_amount: string;
  date: string;
}

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  @Input() selectedCurrency: string | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.refreshTransactions();

    // Subskrybujemy się na zdarzenia z dodawania transakcji
    // i odświeżamy listę transakcji w odpowiedzi na to zdarzenie
    this.subscribeToTransactionAdded();
  }

  getTransactions(): Observable<Transaction[]> {
    const apiUrl = 'http://localhost:8000/api/transactions/';
    return this.http.get<Transaction[]>(apiUrl);
  }

  refreshTransactions() {
    this.getTransactions().subscribe(transactions => {
      this.transactions = transactions;
    });
  }

  private subscribeToTransactionAdded() {
    // Subskrybuj na zdarzenie z CurrencyFormComponent dotyczące dodania transakcji
    // i odśwież listę transakcji
    window.addEventListener('transactionAdded', () => {
      this.refreshTransactions();
    });
  }
}
