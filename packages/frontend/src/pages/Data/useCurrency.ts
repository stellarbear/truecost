import {Currencies, CurrencyKey} from "@truecost/shared";
import {useStorage} from "auxiliary/useStorage";

export const useCurrency = () => {
    const [key, setCurrency] = useStorage<CurrencyKey>('currency', 'usd',
        (val) => (val in Currencies) ? val : 'usd');

    const currency = Currencies[key];

    return {currency, setCurrency};
};
