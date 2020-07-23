import {Dict} from "./useData";
import {Storage} from 'auxiliary/storage'

export interface ICart {
    chunk?: [number, number]
    quantity: number
    options: string[]
}

export interface ICartAdd {
    id: string,
    chunk?: [number, number]
    options: string[]
}

export interface ICartContext {
    add: (data: ICartAdd) => void,
    load: (key: string) => void,
    clear: () => void,
    remove: (id: string) => void,
    data: Dict<ICart>,
}

const prefix = 'cart';
export const defaultCart = (key: string): ICartContext => ({
    add({
            id,
            chunk,
            options = []
        }: ICartAdd) {
        if (id in this.data) {
            this.data[id].quantity++;
            this.data[id].chunk = chunk;
            this.data[id].options = options;
        } else {
            this.data[id] = {
                chunk,
                quantity: 1,
                options
            }
        }

        Storage.setItem([prefix, key], this.data)
    },

    remove(id: string) {
        if (id in this.data) {
            if (this.data[id].quantity === 1) {
                delete this.data[id];
            } else {
                this.data[id].quantity--;
            }
        }

        Storage.setItem([prefix, key], this.data)
    },

    clear() {
        this.data = {};
        Storage.setItem([prefix, key], this.data)
    },

    load(key: string) {
        this.data = Storage.getItem([prefix, key], {})
    },

    data: {}
})
