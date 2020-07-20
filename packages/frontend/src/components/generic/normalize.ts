export const normalize = (data: Record<string, any>) => {
    const clone = JSON.parse(JSON.stringify(data));
    
    for (let key in clone) {
        if (key === "__typename") {
            delete clone[key]
        }

        const value = clone[key];

        if (value instanceof Array) {
            clone[key] = value.map(e => 'id' in e ? e.id : e);
        } else if (value instanceof Object) {
            clone[key] = 'id' in value ? value.id : JSON.stringify(value);
        }
    }

    return clone;
}