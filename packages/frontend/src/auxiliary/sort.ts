const sortByOrder = (ids: string[], handle: Record<string, {
    order: number;
    name: string;
}>) => {
    ids.sort((a, b) => {
        if (handle[a].order !== handle[b].order) {
            return handle[a].order - handle[b].order;
        }

        return handle[a].name.localeCompare(handle[b].name);
    });
};

const dictSort = <T extends {id: string; name: string; order: number}>(handle: Record<string, T>, keys: string[] = Object.keys(handle)) => {
    keys.sort((a, b) => {
        if (handle[a].order !== handle[b].order) {
            return handle[a].order - handle[b].order;
        }

        return handle[a].name.localeCompare(handle[b].name);
    });

    return keys;
};

const arrayToDict = <T>(src: T[], ...keys: string[]): Record<string, T> => {
    const result: Record<string, T> = {};
    for (let entry of src) {
        let pointer: any = entry;

        for (let key of keys) {
            pointer = pointer?.[key];
        }

        if (pointer) {
            result[pointer] = entry
        }
    }
    return result;
}

const dictSortMap = <T extends {id: string; name: string; order: number}>(handle: Record<string, T>): T[] => {
    const keys = dictSort(handle);

    return keys.map(key => handle[key]);
};
export {arrayToDict, sortByOrder, dictSortMap, dictSort};
