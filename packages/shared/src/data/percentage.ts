export const percentage = (price: number, discount: number) => {
    discount = Math.max(0, Math.min(100, discount));

    return Math.ceil(price * (100 - discount) / 100);
}