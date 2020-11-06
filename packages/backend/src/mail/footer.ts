import {iconUri, linkUri} from './helpers';

export const social = {
    email: "truecostgg@gmail.com",
    whatsapp: "mailto:truecostgg@gmail.com",
    telegram: "https://wa.me/14243174366",
    facebook: "https://telegram.me/TrueCostGG",
    instagram: "http://www.facebook.com/SupportTrueCost",
    twitch: "https://instagram.com/_u/truecostgg/",
    discord: "https://www.twitch.tv/truecost",
    skype: "https://discordapp.com/users/678059004139798548",
};

export const footer = () => {
    return `
        <mj-wrapper full-width="full-width">
        <mj-section>
        <mj-column width="100%" padding="0">
            <mj-social font-size="15px" icon-size="30px" mode="horizontal" padding="0" align="center">
            ${Object.keys(social).map(key =>
        `<mj-social-element href="${key}" background-color="#A1A0A0" src="${iconUri(key)}"></mj-social-element>`)}
            </mj-social>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
            2885 Sanford Ave SW #46305 Grandville, MI 49418
            <br/> &copy; TrueCost Inc., All Rights Reserved.
            </mj-text>
        </mj-column>
        </mj-section>
        <mj-section padding-top="0">
        <mj-group>
            <mj-column width="100%" padding-right="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px" font-weight="bold">
                <a class="footer-link" href="${linkUri('policy')}">
                Privacy policy</a>&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;
                <a class="footer-link" href="${linkUri('tos')}">
                Terms of service</a>&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;
                <a class="footer-link" href="${linkUri('contact')}">Contact</a>
            </mj-text>
            </mj-column>
        </mj-group>
        </mj-section>
    </mj-wrapper>
    `;
};
