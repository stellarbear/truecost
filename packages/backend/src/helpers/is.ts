export const isFunction = <T extends (...args: any) => any>(value: unknown): value is T => {
    return typeof value === "function" && !isClass(value);
};

export const isClass = (value: unknown): value is () => any => {
    return typeof value === "function" && value.toString().startsWith("class");
};

export const isNull = (value: unknown): value is null => value === null;
export const isUndefined = (value: unknown): value is undefined => typeof value === "undefined";
export const isDefined = <T>(value: T | undefined): value is T => typeof value !== "undefined";
export const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";
export const isString = (value: unknown): value is string => typeof value === "string";
export const isArray = <T>(value: unknown): value is T[] => Array.isArray(value);
export const isNumber = (value: unknown): value is number => {
    return typeof value === "number" && value === +value;
};