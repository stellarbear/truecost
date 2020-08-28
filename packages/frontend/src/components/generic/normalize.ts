import {isNull} from "@truecost/shared";

export const normalize = (data: Record<string, any>) => {
    const clone = {...data};

    for (const key in clone) {
        if (key === "__typename") {
            delete clone[key];
        }

        const value = clone[key];

        if (value instanceof Array) {
            clone[key] = value.map(e => e instanceof Object && ('id' in e) ? e.id : e);
        } else if (value instanceof Object) {
            clone[key] = 'id' in value ? value.id : JSON.stringify(value);
        } else if (isNull(value)) {
            clone[key] = undefined;
        }
    }

    return clone;
};
