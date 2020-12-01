export type CurrencyKey = "usd" | "eur";

export interface ICurrency {
    val: number;
    label: string;
    id: CurrencyKey;
}

export const Currencies: Record<CurrencyKey, ICurrency> = {
    usd: {val: 1.0, label: '$', id: 'usd'},
    eur: {val: 0.8, label: '€', id: 'eur'},
};