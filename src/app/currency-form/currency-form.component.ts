// currency-form.component.ts

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NbpApiResponse } from '../nbp-api-response.model'; // importujemy nasze interfejsy

interface Currency {
  currency: string;
  code: string;
}

@Component({
  selector: 'app-currency-form',
  templateUrl: './currency-form.component.html',
  styleUrls: ['./currency-form.component.css']
})
export class CurrencyFormComponent implements OnInit {
  public currencies: Currency[] = [];
  @Output() currencySelected = new EventEmitter<string>();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    console.log('CurrencyFormComponent initialized');
    this.fetchCurrencies();
  }

  fetchCurrencies() {
    const apiUrl = 'http://api.nbp.pl/api/exchangerates/tables/A/?format=json';

    this.http.get<NbpApiResponse[]>(apiUrl).subscribe(data => {
      const rates = data[0].rates; // pobieramy listę walut

      this.currencies = rates.map(rate => ({
        currency: rate.currency,
        code: rate.code // poprawka na rate.code
      }));
    });
  }


  onCurrencySelected(value:string): void {
		this.currencySelected.emit(value);
    console.log("form: " + value);
	}
}
