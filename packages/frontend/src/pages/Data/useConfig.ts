import { Dict, SafeJSON } from "@truecost/shared";

export interface IReview {
    name: string;
    data: string;
}
 
export const useConfig = (data: IReview[]) => data.reduce((acc, cur) => {
    acc[cur.name] = SafeJSON.parse(cur.data, {});

    return acc;
}, {} as Dict<any>);
