export const convertTagNameToUrl = (src: string) => {
    const filtered = src.replace(/[^a-zA-Z0-9]/g, " ");
    const spaced = filtered.replace(/  +/g, " ");
    return spaced.toLocaleLowerCase().replace(/ /g, "_");
};
