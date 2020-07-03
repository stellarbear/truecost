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

const dictSort = <T extends { id: string; name: string; order: number }>(handle: Record<string, T>) => {
    const keys = Object.keys(handle);
    keys.sort((a, b) => {
        if (handle[a].order !== handle[b].order) {
            return handle[a].order - handle[b].order;
        }

        return handle[a].name.localeCompare(handle[b].name);
    });

    return keys;
};

const arrayToDict = (data?: any[], key = "id") => {
    const result = {};

    if (!Array.isArray(data)) {
        return result;
    }

    for (const entry of data) {
        if (entry.active) {
            result[entry[key]] = entry;
        }
    }

    return result;
};

export {sortByOrder, arrayToDict, dictSort};
