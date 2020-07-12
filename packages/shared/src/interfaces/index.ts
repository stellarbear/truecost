import {OptionType, OptionArea} from "..";

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
}

export interface IBlog extends IBaseMeta {
    preview: string;
    images: string[];
    date: number;

    text?: string;
}

export interface IGame extends IBase {
    twitter: string;
    background: string[];
    assistant: string[];
}

export interface IRange {
    at: number
    price: number
    mark: string
}

export interface IItem extends IBaseMeta {
    link: string;
    images: string[];
    price: number;
    range: IRange[];
    discount: number;
    limit: number;
    topOffer: boolean

    obtain?: string;
    requirements?: string;

    tag: {id: string}[]
    option: {id: string}[]
    category: {id: string}[]
    item: {id: string}[]
}


export interface ICategory extends IBase, IBaseGame {
    parent: {id: string};
}
export interface IOption extends IBase, IBaseGame {
    price: number
    free: number
    type: OptionType
    area: OptionArea
}

export interface ITag extends IBase, IBaseGame {
}