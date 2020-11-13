export interface IReview {
    who: string;
    text: string;
    title: string;
}

export const useReview = (data: IReview[]) => data;
