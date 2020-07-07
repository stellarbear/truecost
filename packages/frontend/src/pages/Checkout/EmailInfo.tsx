import React, {useContext, useEffect, useState} from "react";
import {Button, Checkbox, CircularProgress, Divider, Hidden, Typography} from "@material-ui/core";
import {useLazyQuery} from "react-apollo";
import {gql} from "apollo-boost";

import {loadStripe} from '@stripe/stripe-js';
import {validateEmail} from "auxiliary/validate";
import {CartContext} from "pages/Base/CartWrapper";
import {InputField} from "components";
import PriceTypo from "pages/Base/PriceTypo";
import CodeDialog from "./CodeDialog";
import {IUser} from "pages/Data/Wrapper";

const CHECKOUT_SESSION = gql`
    query createCheckoutSession($json: String!) {
        createCheckoutSession(json: $json)
    }
`;

interface EmailInfoProps {
    info: Record<string, any>;
}

interface IState {
    pass: string[];
    email: string;
    editable: boolean;
    verified: boolean;
}

interface IDiscount {
    total: number;
    pass: string[];
}

const defaultState = (user: IUser | undefined): IState => ({
    pass: [],
    email: user?.email ?? "",
    editable: user?.email ? false : true,
    verified: user?.email ? true : false,
});
const defaultEmailError = (user: IUser | undefined): boolean => (!!!user?.email ?? true);
const defaultDiscount = (user: IUser | undefined): IDiscount => ({
    total: user?.total ?? 0,
    pass: Object.keys(user?.pass ?? {}),
});

const EmailInfo: React.FC<EmailInfoProps> = ({
                                                 info,
                                             }) => {
    const {
        payment: {stripe: stripeKey},
        cart: {data},
        store: {passList},
        math: {calculateTotal, stringifyPrice, getItemPrice, validateDiscount, applyDiscount, collectDiscounts},
    } = useContext(CartContext);
    const {store: {user}} = useContext(UserContext);
    const [modal, setModal] = React.useState(false);

    const [checkoutQuery, {called: checkoutCalled, loading: checkoutLoading, data: checkoutData}] = useLazyQuery(CHECKOUT_SESSION);

    const [hovered, setHovered] = useState("");

    const [state, setState] = useState<IState>(defaultState(user));
    const [emailError, setEmailError] = useState(defaultEmailError(user));
    const [discount, setDiscount] = useState<IDiscount>(defaultDiscount(user));
    const totalDiscount = collectDiscounts(discount.pass, state.pass);

    useEffect(() => {
        if (user) {
            setState(defaultState(user));
            setDiscount(defaultDiscount(user));
            setEmailError(defaultEmailError(user));
        }
    }, [user]);

    useEffect(() => {
        if (checkoutCalled && !checkoutLoading) {
            const id = checkoutData.createCheckoutSession;
            if (id === "null") {
                //  TODO: error handle
                return;
            }

            redirectToStripe();
        }
    }, [checkoutData]);
    const redirectToStripe = async () => {
        const stripe = await loadStripe(stripeKey);
        if (stripe) {
            const {error} = await stripe.redirectToCheckout({
                sessionId: checkoutData.createCheckoutSession,
            });
            debugger;
        }
    };

    const handleStateChange = (key: keyof IState, value: any) => {
        const newState = {...state, [key]: value};
        setState(newState);
    };

    const updateUserPassInfo = (passInfo: string) => {
        const {pass, total} = validateDiscount(passInfo);
        setDiscount({total, pass: Object.keys(pass)});
        setState({...state, pass: [], verified: true});
        setModal(false);
    };

    const renderDialog = () => {
        return (
            <CodeDialog
                email={state.email}
                bubbleResult={updateUserPassInfo}
                onClose={() => {
                    setModal(false);
                }}
                open={modal}
            />
        );
    };

    const renderEmail = () => {
        const {discount} = totalDiscount;
        //discountQuery({ variables: { email: state.email } })
        return (
            <div
                style={{display: "flex", flexDirection: "column", marginTop: 16, marginBottom: 8}}>
                <div style={{display: "flex"}}>
                    <InputField
                        editable={state.editable}
                        style={{width: "100%"}}
                        label="email"
                        value={state.email}
                        onChangeEvent={(value) => {
                            handleStateChange("email", value);
                            setDiscount({total: 0, pass: []});
                            setEmailError(!validateEmail(value));
                        }}/>
                    <Button style={{marginLeft: 8, width: 120}}
                            variant="contained" color={!state.verified ? "secondary" : "primary"}
                            disabled={emailError || state.verified}
                            onClick={() => setModal(true)}>{
                        <div>
                            <Typography
                                style={{whiteSpace: discount === 0 ? "normal" : "nowrap"}}>
                                {!state.verified ? "Verify" : `${discount} %`}
                            </Typography>
                            {state.verified && discount !== 0 && (
                                <Typography
                                    variant="caption">
                                    {`discount`}
                                </Typography>
                            )}
                        </div>
                    }</Button>
                </div>
                <Typography variant="caption" style={{textAlign: "right"}}>Please, be sure you provided correct email
                    address.</Typography>
                <Typography variant="caption" style={{textAlign: "right"}}>We will send 6 digit code to verify
                    it.</Typography>
            </div>
        );
    };

    const renderPass = () => {
        const buildPass = (id: string) => {
            const {price, discount: percent, duration, expiration, name, isActive, text} = passList[id];
            const alreadyPurchased = discount.pass.includes(id);

            const [color, content] = isActive ? (alreadyPurchased ? ["secondary", "activated"] : ["primary", text]) : ["default", "disabled"];

            return (
                <div key={`pass-${id}`}>
                    <Divider style={{margin: 8}}/>
                    <div style={{
                        display: "flex", alignItems: "center", marginBottom: 8, cursor: "pointer",
                        opacity: isActive && !alreadyPurchased ? 1.0 : 0.4,
                        backgroundColor: id === hovered ? "rgba(0, 0, 0, 0.15)" : "transparent",
                        transition: "all 0.3s",
                    }}
                         onMouseEnter={() => setHovered(id)}
                         onMouseLeave={() => setHovered("")}
                         onClick={(isActive && !alreadyPurchased)
                             ? () => setState({
                                 ...state,
                                 pass: state.pass.includes(id) ? state.pass.filter(p => p !== id) : [...state.pass, id],
                             })
                             : undefined}>
                        <Hidden xsDown>
                            <Typography style={{width: "100%", textAlign: "left", marginLeft: 8}}>{content}</Typography>
                        </Hidden>
                        <Hidden smUp>
                            <div style={{width: "100%"}}></div>
                        </Hidden>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            width: "100%",
                            alignItems: "flex-end",
                        }}>
                            <div style={{display: "flex"}}>
                                <Typography>{name}</Typography>
                                <Typography style={{marginLeft: 8, whiteSpace: "nowrap"}}>{`${percent} %`}</Typography>
                            </div>
                            <Hidden xsDown>
                                <Typography component="div" variant="caption"
                                            style={{textAlign: "center"}}>{duration > 0 ? `${duration} days` : `to ${new Date(expiration).toLocaleDateString()}`}</Typography>
                            </Hidden>
                            <Hidden smUp>
                                <Typography component="div" variant="caption"
                                            style={{textAlign: "center"}}>{content}</Typography>
                            </Hidden>
                        </div>

                        <Checkbox
                            disabled={!isActive || alreadyPurchased}
                            checked={alreadyPurchased || state.pass.includes(id)}
                            style={{marginLeft: 16}}/>
                        <Typography variant="h5" style={{
                            minWidth: 80,
                            textAlign: "center",
                        }}>{`${isActive && !alreadyPurchased ? price : 0} $`}</Typography>
                    </div>
                </div>
            );
        };

        const passes = Object.keys(passList);
        return passes.map(key => buildPass(key));
    };

    const renderCheckout = () => {
        const total = calculateTotal();
        return (
            <div style={{maxWidth: 210, margin: "0 0 0 auto"}}>
                <Button
                    color="primary"
                    variant="contained"
                    disabled={!state.verified || (total + totalDiscount.price) === 0}
                    style={{float: "right", minHeight: 66, marginTop: 16, width: "100%"}}
                    onClick={() => state.verified && checkoutQuery({
                        variables: {
                            json: JSON.stringify({
                                data,
                                state: {
                                    email: state.email,
                                    pass: JSON.stringify(state.pass),
                                    info: JSON.stringify(info),
                                },
                            }),
                        },
                    })}>
                    {checkoutLoading ? <CircularProgress size={24}/> :
                        <div>
                            {"Checkout"}
                            <PriceTypo
                                price={applyDiscount(total, totalDiscount.discount) + totalDiscount.price}
                                priceWithDiscount={total + totalDiscount.price}/>
                        </div>
                    }
                </Button>
            </div>
        );
    };


    return (
        <React.Fragment>
            {Object.keys(passList).length > 0 &&
            <React.Fragment>
                <Typography style={{textAlign: "right", marginTop: 16, marginBottom: -4, opacity: 0.4}}>discount
                    plans</Typography>
                {renderPass()}
            </React.Fragment>
            }
            <Typography style={{textAlign: "right", marginTop: 16, marginBottom: -4, opacity: 0.4}}>contact
                email</Typography>
            <Divider style={{margin: 8}}/>
            {renderEmail()}
            {renderCheckout()}
            {renderDialog()}
        </React.Fragment>
    );
};

export default EmailInfo;
