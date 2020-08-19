import {linkUri} from "../helpers";
import {header} from "../header";
import {footer} from "../footer";
import {domain} from "../../helpers/route";

export const orderEmail = (code: string, data: Record<string, string>) => {
    const logo = linkUri('/default/logo.png');
    const assistant = linkUri('/default/assistant.png');
    const trackUrl = `${domain}/track`;
    console.log(data);

    return `
    <mjml>
        ${header("Account verification", `${domain} registration`)}
        <mj-body background-color="#E7E7E7" width="600px">
            <mj-section full-width="full-width" background-color="#00695f" padding-bottom="0">
                <mj-column width="100%">
                    <mj-image src="${logo}" alt="" align="center" width="150px" />
                </mj-column>
                <mj-column width="100%" background-color="#ffffff" padding="15px" padding-bottom="0px">
                    <mj-text color="#212b35" font-weight="bold" font-size="20px">
                    Order receipt:
                    </mj-text>
                    <mj-text color="#637381" font-size="35px" padding-top="20px">
                    <strong>${code}</strong>
                    </mj-text>
                    <mj-text color="#637381" font-size="16px">
                        <ul>
                            ${Object.keys(data).map(key =>
                                `<li style="padding-bottom: 8px"><strong>${key}:</strong> ${data[key]}`)}
                        </ul>
                    </mj-text>
                </mj-column>
            </mj-section>
            <mj-wrapper padding-top="0" padding-bottom="0" css-class="body-section">
                <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
                    <mj-column width="100%">
                    <mj-divider border-color="#DFE3E8" border-width="1px" />
                    </mj-column>
                    <mj-column width="80%">
                    <mj-text color="#637381" font-size="16px">
                        Note: Use code and email to <a class="text-link" href="${trackUrl}">track your order</a>. Or just sign in to your account
                    </mj-text>
                    </mj-column>
                    <mj-column width="20%">
                    <mj-image width="100px" src="${assistant}" />
                    </mj-column>
                </mj-section>
            </mj-wrapper>
            ${footer()}
        </mj-body>
    </mjml>
    `
}