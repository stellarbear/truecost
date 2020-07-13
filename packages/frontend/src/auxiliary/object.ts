const omit = (obj: Record<string, any>, props: string | string[]) => {
    const omitProps = Array.isArray(props) ? [...props] : [props];

    const result: Record<string, any> = {};
    Object.keys(obj).forEach(key => {
        if (!omitProps.includes(key)) {
            result[key] = obj[key];
        }
    });

    return result;
};

const subtract = (src: Record<string, any>, dst: Record<string, any>) => {
    const result: Record<string, any> = {};
    Object.keys(src).forEach(key => {
        if (dst[key] != src[key]) {
            result[key] = src[key];
        }
    });

    return result;
};


const subtractNotPure = (src: Record<string, any>, dst: Record<string, any>) => {
    Object.keys(src).forEach(key => {
        if (key != "id") {
            if (dst[key] == src[key]) {
                delete src[key];
            }
        }
    });

    return src;
};

export {omit, subtract, subtractNotPure};
