import {OptionArea, OptionMerge, OptionType} from "..";
import {StatusType} from "../enums";

export interface IBaseUser {
    user: {id: string};
}

export interface IBaseGame {
    game: {id: string};
}

export interface IBase {
    id: string;
    name: string;
    order: number;
    active: boolean;
}

export interface IUser extends IBase {
    role: string;
    email: string;
    id: string;

    subscription?: ISubscription;
    subscribeDate?: Date;
}

export interface IBlog extends IBase {
    url: string;
    preview: string;
    images: string[];
    date: number;

    text: string;
    game?: {id: string};
}

export interface IGame extends IBase {
    url: string;
    seo: string;
    twitter: string;
    preview: string[];
    background: string[];
    assistant: string[];
}

export interface IRangeData {
    e?: number;      //eta
    a: number;       //at
    p: number;       //price
    m: string;       //mark
}

export interface IRange {
    s: number;           //step
    o: boolean;          //single
    d: IRangeData[];     //data
}

export interface IItem extends IBase, IBaseGame {
    url: string;
    link: string;
    images: string[];
    eta: number;
    buy: number;
    price: number;
    range: IRange;
    discount: number;
    limit: number;
    topOffer: boolean;
    direct: boolean;

    obtain?: string;
    requirements?: string;

    tag: string[];
    option: string[];
    item: string[];
}

export interface IOption extends IBase, IBaseGame {
    price: number;
    free: number;
    type: OptionType;
    area: OptionArea;
    merge: OptionMerge;
}

export interface IInfo extends IBase, IBaseGame {
    text: string;
    redirect: string;
    images: string[];

    tag: string[];
    item: string[];
}


export interface ITag extends IBase, IBaseGame {
    color: string;
    children: string[];
}

export interface IBooking extends IBase, IBaseUser {
    status: StatusType;
    info: string;
    data: string;
}

export interface ISubscription extends IBase {
    days: number;
    price: number;
    discount: number;
    description: string;
}