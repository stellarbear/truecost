import {domain, linkUri} from "../helpers";
import {header} from "../header";
import {footer} from "../footer";

export const forgetEmail = (forget: string, userId: string) => {
    const forgetUrl = `${domain}/password/forget/${forget}/${userId}`;
    const logo = linkUri('/default/logo.png');
    const assistant = linkUri('/default/assistant.png');

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
                    Password reset request
                    </mj-text>
                    <mj-text color="#637381" font-size="16px">
                    We have received a request to reset your password on <a class="text-link" href="${domain}">${domain}</a>
                    <br/> In case you didn't do this, you may safely ignore this mailing
                    <br/>
                    <br/> In order to reset your password, click the button below
                    </mj-text>
                    <mj-button background-color="#DC004E" align="center" color="#ffffff" font-size="17px" font-weight="bold" href="${forgetUrl}" width="300px">
                    Reset password
                    </mj-button>
                    <mj-text color="#637381" font-size="16px">
                    If the button is not clickable you may use the following link to complete verification <a class="text-link" href="${forgetUrl}">${forgetUrl}</a>
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
                        Note: this url will be valid for only 1 hour! If it is already expired, you may request password reset again.
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