import { social } from '@truecost/shared';
import {iconUri, linkUri} from './helpers';

export const footer = () => {
    return `
        <mj-wrapper full-width="full-width">
        <mj-section>
        <mj-column width="100%" padding="0">
            <mj-social font-size="15px" icon-size="30px" mode="horizontal" padding="0" align="center">
            ${Object.values(social).map(([key, value]) =>
        `<mj-social-element href="${value}" background-color="#A1A0A0" src="${iconUri(key)}"></mj-social-element>`)}
            </mj-social>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
            30 N Gould St Ste R Sheridan, WY 82801
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
