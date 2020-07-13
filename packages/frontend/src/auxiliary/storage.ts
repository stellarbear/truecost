class Storage {
    static getItem = (key: string | string[], defaultValue: any = null) => {
        if (typeof window === 'undefined') {
            return defaultValue;
        }

        

        if (Array.isArray(key)) {
            const storageValue = localStorage.getItem(key[0]);

            if (storageValue == null) {
                return defaultValue;
            }

            let reference = JSON.parse(storageValue);
            let path = key.slice(1);
            while (path.length > 0) {
                const [first, ...rest] = path;
                if (reference[first] === undefined) {
                    return defaultValue;
                }

                reference = reference[first];
                path = rest;
            }

            if (!Array.isArray(defaultValue) && defaultValue instanceof Object) {
                return ({...defaultValue, ...reference});
            }

            return reference;
        } else {
            const storageValue = localStorage.getItem(key);

            if (storageValue == null) {
                return defaultValue;
            }
        }
    };

    static setItem = (key: string | string[], value: any): void => {
        if (typeof window === 'undefined') {
            return;
        }

        if (Array.isArray(key)) {
            const storageValue = localStorage.getItem(key[0]);
            const result = JSON.parse(storageValue || "{}");
            let reference = result;
            let path = key.slice(1);
            while (path.length > 1) {
                const [first, ...rest] = path;
                if (reference[first] === undefined) {
                    reference[first] = {};
                }

                reference = reference[first];

                path = rest;
            }
            reference[path[0]] = value;

            localStorage.setItem(key[0], JSON.stringify(result));
        } else {
            const storageValue = localStorage.getItem(key);

            if (storageValue == null) {
                return;
            }

            localStorage.setItem(key, value);
        }
    };
}

export {Storage};
