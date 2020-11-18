export const sequence = (count: number, modifier = (input: number) => input) => {
    return Array.from(Array(count), (_, i) => i).map(modifier);
};