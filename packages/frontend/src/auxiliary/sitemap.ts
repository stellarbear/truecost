import {frontend} from "./route";

const basePages = [
    "login",
    "register",
    "track",
    "discount",
    "contact",
    "policy",
    "tos",
];

export const generateSiteMap = (games: string[], blogs: string[], items: {u: string; g: string}[]) => {

    return (
        `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
                <loc>${frontend.uri}</loc>
                <changefreq>always</changefreq>
                <priority>1</priority>
             </url>
             ${games.map((game) => (
             `<url>
                 <loc>${frontend.uri}/${game}</loc>
                 <changefreq>always</changefreq>
                 <priority>0.9</priority>
              </url>
            `))
             .join('')}
             ${blogs.map((blog) => (
             `<url>
                 <loc>${frontend.uri}/post/${blog}</loc>
                 <changefreq>always</changefreq>
                 <priority>0.8</priority>
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
             ${basePages.map(page => (
             `<url>
                 <loc>${frontend.uri}/${page}</loc>
                 <changefreq>monthly</changefreq>
                 <priority>0.7</priority>
             </url>
             `)).join('')}
        </urlset>
        `
    );
};