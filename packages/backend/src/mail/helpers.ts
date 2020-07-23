export const domain = `https://truecostd2.store`;
export const linkUri = (to: string) => `${domain}/${to}`
export const iconUri = (icon: string) => `${linkUri("social")}/${icon}.png`;