import {OptionType, OptionArea} from "@truecost/shared";

export interface IGame {
    game: {id: string};
}

export interface IBase {
    id: string;
    url: string;
    name: string;
    order: number;
    active: boolean;
}

export interface IMeta extends IBase {
    url: string,
    metatag: string
}

export interface IUser {
    role: string;
    email: string;
    name: string;
    id: string;
}

export interface IBlog extends IMeta {
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

export interface IItem extends IMeta {
    link: string;
    images: string[];
    price: number;
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


export interface ICategory extends IBase, IGame {
    parent: {id: string};
}
export interface IOption extends IBase, IGame {
    price: number
    free: number
    type: OptionType
    area: OptionArea
}

export interface ITag extends IBase, IGame {
}