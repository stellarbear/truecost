import {OptionType, OptionArea, OptionMerge} from "..";
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

export interface IBaseMeta extends IBase {
    url: string,
    metatag: string
}

export interface IUser {
    role: string;
    email: string;
    name: string;
    id: string;

    subscription?: string
    subscribeDate?: Date
}

export interface IBlog extends IBaseMeta {
    preview: string;
    images: string[];
    date: number;

    text?: string;
}

export interface IGame extends IBaseMeta {
    twitter: string;
    background: string[];
    assistant: string[];
}

export interface IRangeData {
    a: number       //at
    p: number       //price
    m: string       //mark
}

export interface IRange {
    e: number           //eta
    s: number           //step
    o: boolean          //single
    d: IRangeData[]     //data
}

export interface IItem extends IBaseMeta, IBaseGame {
    link: string;
    images: string[];
    eta: number;
    price: number;
    range: IRange;
    discount: number;
    limit: number;
    topOffer: boolean

    obtain?: string;
    requirements?: string;

    tag: string[]
    option: string[]
    item: string[]
}

export interface IOption extends IBase, IBaseGame {
    price: number
    free: number
    type: OptionType
    area: OptionArea
    merge: OptionMerge
}

export interface IInfo extends IBase, IBaseGame {
    text: string
    redirect: string
    images: string[];

    tag: string[]
    item: string[]
}


export interface ITag extends IBase, IBaseGame {
    children: string[]
}

export interface IBooking extends IBase, IBaseUser {
    status: StatusType
    info: string
    data: string
}

export interface ISubscription extends IBase {
    days: number
    price: number
    discount: number
    description: string
}