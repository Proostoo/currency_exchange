import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { NbpApiResponse } from '../nbp-api-response.model';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnChanges {
  @Input() selectedCurrency: string | undefined;
  public chart: Chart | undefined;
  public dateRanges = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
  ];
  public selectedRange = this.dateRanges[0]; // domyślnie wybrany zakres

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCurrencyRatesAndCreateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCurrency'] && !changes['selectedCurrency'].firstChange) {
      this.fetchCurrencyRatesAndCreateChart();
    }
  }

  fetchCurrencyRatesAndCreateChart() {
    const apiUrl = `http://api.nbp.pl/api/exchangerates/rates/a/${this.selectedCurrency}/last/${this.selectedRange.days}/?format=json`;

    this.http.get<NbpApiResponse>(apiUrl).subscribe(data => {
      console.log('API Response:', data);

      const rates = data.rates;
      const dates = rates.map(rate => rate.effectiveDate);
      const midValues = rates.map(rate => rate.mid);

      this.createChart(dates, midValues);
    });
  }

  createChart(dates: string[], rates: number[]) {
    const ctx = document.getElementById('MyChart') as HTMLCanvasElement;

    if (ctx) {
      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [
            {
              label: `${this.selectedCurrency} Exchange Rate`,
              data: rates,
              backgroundColor: 'blue',
              borderColor: 'blue',
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Dates'
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Exchange Rate'
              }
            }
          }
        }
      });
    }
  }

  onSelectRange(range: any) {
    this.selectedRange = range;
    this.fetchCurrencyRatesAndCreateChart();
  }
}
