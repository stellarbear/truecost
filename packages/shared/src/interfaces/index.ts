import {OptionType, OptionArea, OptionMerge} from "..";

export interface IBaseGame {
    game: { id: string };
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

export interface IRange {
    at: number
    price: number
    mark: string
}

export interface IItem extends IBaseMeta, IBaseGame {
    link: string;
    images: string[];
    price: number;
    range: IRange[];
    single: boolean;
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

export interface ITag extends IBase, IBaseGame {
}
