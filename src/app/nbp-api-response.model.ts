// nbp-api-response.model.ts

export interface NbpApiResponse {
    table: string;
    currency: string;
    code: string;
    rates: CurrencyRate[];
  }
  
  export interface CurrencyRate {
    no: string;
    effectiveDate: string;
    mid: number;
    currency: string;
    code: string;
  }
  