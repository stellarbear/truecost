export interface ISort {
    id: string;
    name: string;
    order: number;
}

const dictSort = <T extends ISort>(handle: Record<string, T>, pick: string[] = Object.keys(handle)) => {
    pick.sort((a, b) => {
        if (handle[a].order !== handle[b].order) {
            return handle[a].order - handle[b].order;
        }

        return handle[a].name.localeCompare(handle[b].name);
    });

    return pick;
};

const arrayToDict = <T>(src: T[], ...keys: string[]): Record<string, T> => {
    const result: Record<string, T> = {};
    for (const entry of src) {
        let pointer: any = entry;

        for (const key of keys) {
            pointer = pointer?.[key];
        }

        if (pointer) {
            result[pointer] = entry;
        }
    }
    return result;
};

const dictSortMap = <T extends ISort>(handle: Record<string, T>, pick: string[] = Object.keys(handle)): T[] => {
    const keys = dictSort(handle, pick);

    return keys.map(key => handle[key]);
};

export {arrayToDict, dictSortMap, dictSort};
