import React, {useEffect, useRef, useState} from "react";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@material-ui/core";
import {useLazyQuery} from "react-apollo";
import {gql} from "apollo-boost";
import {InputField} from "components";
import {CSSProperties} from "@material-ui/core/styles/withStyles";

const EMAIL_VERIFY = gql`
    query emailVerify($email: String!) {
        emailVerify(email: $email)
    }
`;
const CODE_VERIFY = gql`
    query codeVerify($email: String!, $code: String!) {
        codeVerify(email: $email, code: $code)
    }
`;

interface CodeDialogProps {
    email: string;
    open: boolean;
    onClose: () => void;
    bubbleResult: (passInfo: string) => void;
}

const useFocus = () => {
    const htmlElRef = useRef(null);
    const setFocus = () => {
        if (htmlElRef?.current) {
            const element: HTMLInputElement = htmlElRef.current as any;
            element.focus();
            element.selectionEnd = 0;
            element.selectionStart = 0;
        }
    };

    return [htmlElRef, setFocus];
};

const length = 6;
const defaultInput = new Array(length).fill(0).reduce((acc, cur, ind) => ({...acc, [ind]: ""}), {});
const CodeDialog: React.FC<CodeDialogProps> = ({
                                                   open,
                                                   email,
                                                   onClose,
                                                   bubbleResult,
                                               }) => {
    const [input, setInput] = useState(defaultInput);
    const refs = new Array(length).fill(0).map(_ => useFocus());
    const dialogRef = useRef();

    const [loadingCode, setLoadingCode] = React.useState(false);
    const [loadingEmail, setLoadingEmail] = React.useState(true);
    const [invalidCode, setInvalidCode] = React.useState(false);

    const [emailVerifyQuery, {called: emailVerifyCalled, loading: emailVerifyLoading, data: emailVerifyData}] =
        useLazyQuery(EMAIL_VERIFY, {fetchPolicy: "network-only"});
    const [codeVerifyQuery, {called: codeVerifyCalled, loading: codeVerifyLoading, data: codeVerifyData}] =
        useLazyQuery(CODE_VERIFY, {fetchPolicy: "network-only"});

    useEffect(() => {
        if (Object.values(input).join("").length === length) {
            onCodeVerify();
        }
    }, [input]);

    useEffect(() => {
        if (open) {
            setLoadingEmail(true);
            setInput(defaultInput);
            emailVerifyQuery({variables: {email}});
        }
    }, [open]);

    useEffect(() => {
        if (emailVerifyData != undefined) {
            setLoadingEmail(false);
        }
    }, [emailVerifyData]);

    useEffect(() => {
        if (codeVerifyData != undefined) {
            setLoadingCode(false);
            if (codeVerifyData.codeVerify) {
                bubbleResult(codeVerifyData.codeVerify);
            } else {
                setInvalidCode(true);
            }
        }
    }, [codeVerifyData]);

    const onCodeVerify = () => {
        setLoadingCode(true);
        codeVerifyQuery({variables: {email, code: Object.values(input).join("")}});
    };

    const renderLoading = (style: CSSProperties = {}) => (
        <div style={{display: "flex", justifyContent: "center"}}>
            <CircularProgress style={{...style}} color="inherit"/>
        </div>
    );

    const renderError = () => (
        <div>
            <Typography>
                Something went wrong!
            </Typography>
            <Typography>
                We could not deliver email to your address.
            </Typography>
            <Typography style={{marginTop: 16}}>
                Please, contact customer support.
            </Typography>
        </div>
    );

    const renderCode = () => (
        <React.Fragment>
            <Typography>{`We have sent a verification code to ${email} (may appear in spam folder)`}</Typography>
            <div style={{display: "flex", justifyContent: "center", margin: "16px -16px"}}>
                {
                    new Array(length).fill(0).map((e, i) =>
                        <InputField
                            value={input[i]}
                            key={`code-${i}`}
                            debounceTimer={0}
                            inputRef={refs[i][0]}
                            style={{width: 35, margin: "0px 2px"}}
                            inputStyle={{height: 50}}
                            force={new Date().getTime()}
                            onClick={() => {
                                const refocus = refs[i][1] as (() => {});
                                refocus();
                            }}
                            onChangeEvent={(value) => {
                                setInvalidCode(false);

                                const data = value.replace(/[^0-9]/g, "").split('');
                                if (data.length === 0) {
                                    return;
                                }

                                let next = i;
                                let newInput = {...input};
                                if (data.length >= length) {
                                    next = length - 1;
                                    newInput = data.slice(0, length).reduce((acc, cur, ind) => ({
                                        ...acc,
                                        [ind]: cur,
                                    }), input);
                                } else {
                                    next = i + 1;
                                    newInput[i] = data[0];

                                    for (let j = i + 1; j < length; j++) {
                                        newInput[j] = "";
                                    }
                                }

                                setInput(newInput);

                                const refocus = refs[next < length ? next : i][1] as (() => {});
                                refocus();
                            }}
                        />,
                    )
                }
            </div>
            <Typography
                component="div"
                variant="caption" color="secondary"
                style={{
                    opacity: invalidCode ? 1.0 : 0.0,
                    textAlign: "center",
                    marginTop: -8,
                }}>
                Invalid code provided
            </Typography>
        </React.Fragment>
    );

    const renderDialog = () => {
        return (
            <Dialog
                open={open}
                ref={dialogRef[0]}
                disableBackdropClick
                onClose={() => onClose()}
            >
                <DialogTitle>{"Verification code"}</DialogTitle>
                <DialogContent
                    style={{maxWidth: 300}}>
                    {loadingEmail
                        ? renderLoading()
                        : emailVerifyData?.emailVerify === true
                            ? renderCode()
                            : renderError()
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onClose()} color="primary">
                        Cancel
                    </Button>
                    <Button
                        style={{minWidth: 90}}
                        onClick={() => onCodeVerify()}
                        color="primary" variant="contained"
                        disabled={loadingEmail || Object.values(input).join("").length !== length}>
                        {loadingCode ? renderLoading({height: 24, width: 24}) : `Verify`}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };


    return (
        <React.Fragment>
            {renderDialog()}
        </React.Fragment>
    );
};

export default CodeDialog;
