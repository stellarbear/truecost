export const domain = `https://truecost.gg`;
export const linkUri = (to: string) => `${domain}/${to}`
export const iconUri = (icon: string) => `${linkUri("social")}/${icon}.png`;