export const convertTagNameToUrl = (src: string) => {
    const filtered = src.replace(/[^a-zA-Z]/g, " ");
    const spaced = filtered.replace(/  /g, " ");
    return spaced.toLocaleLowerCase().replace(/ /g, "_");
};
