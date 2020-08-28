import {domain} from "../helpers/route";

export const linkUri = (to: string) => `${domain}/${to}`;
export const iconUri = (icon: string) => `${linkUri("social")}/${icon}.png`;