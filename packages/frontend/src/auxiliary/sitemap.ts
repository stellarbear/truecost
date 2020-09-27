import {frontend} from "./route";

const basePages = [
    "login",
    "register",
    "track",
    "discount",
    "contact",
    "policy",
    "about",
    "tos",
];

export const generateSiteMap = (games: string[], items: {u: string; g: string}[]) => {

    return (
        `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${basePages.map(page => (
            `<url>
                <loc>${frontend.uri}/${page}</loc>
                <changefreq>monthly</changefreq>
                <priority>0.7</priority>
            </url>
            `)).join('')}
            ${games.map((game) => (
            `<url>
                <loc>${frontend.uri}/${game}</loc>
                <changefreq>always</changefreq>
                <priority>1</priority>
             </url>
           `))
            .join('')}
            ${items.map(({u, g}) => (
            `<url>
                <loc>${frontend.uri}/${g}/item/${u}</loc>
                <changefreq>daily</changefreq>
                <priority>0.8</priority>
            </url>
            `)).join('')}
        </urlset>
        `
    );
};