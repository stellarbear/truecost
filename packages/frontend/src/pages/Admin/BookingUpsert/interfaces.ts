export interface IBookingForm {
    id?: string;
    total: number;
    data: string;
    pi: string;

    info: string;

    game: string;
    email: string;
    subscription: string;
    currency: string;
}

export interface IBookingData {
    id: string;
    total: number;
    data: string;
    pi: string;
    info: string;
    user: {
        email: string;
    };
    currency: string;
}