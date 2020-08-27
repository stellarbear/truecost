import {gql} from "@apollo/client";

const getResolverName = (input: any) => {
    try {
        return input
            .definitions[0]
            .selectionSet
            .selections[0]
            .name
            .value;
    } catch {
        const text: string = input.loc.source.body;
        const start = text.indexOf("{");
        const end = text.indexOf("(", start);
        const temp = text.slice(start, end);

        return temp.replace(/\s/g, "");
    }
};

export interface ICRUDgql {
    name: string;
    items: string;
}

class CRUDgql {
    readonly name: string;
    readonly items: string;

    constructor({name, items}: ICRUDgql) {
        this.name = name;
        this.items = items;
    }

    get get() {
        const {items, name} = this;
        return gql`
            query ${name}Get ($take: Int!, $skip: Int!, $input: ${name}Input!){
            ${name}Get(take: $take, skip: $skip, input: $input) {
            items{
            id
            ${items}
            }
            count
            }
            }
        `;
    }

    get delete() {
        const {name} = this;
        return gql`
            mutation ${name}Delete ($input: ${name}Input!) {
            ${name}Delete(input: $input)
            }
        `;
    }

    get upsert() {
        const {name} = this;
        return gql`
            mutation ${name}Upsert ($input: ${name}Input!) {
            ${name}Upsert(input: $input) {
            id
            }
            }
        `;
    }

}


export {getResolverName, CRUDgql};
