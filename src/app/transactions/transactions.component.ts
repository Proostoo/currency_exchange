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
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  @Input() selectedCurrency: string | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getTransactions().subscribe(transactions => {
      this.transactions = transactions;
    });
  }

  getTransactions(): Observable<Transaction[]> {
    const apiUrl = 'http://localhost:8000/api/transactions/';
    return this.http.get<Transaction[]>(apiUrl);
  }


}