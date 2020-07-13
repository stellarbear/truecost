import React from 'react';
import {Helmet} from 'react-helmet';
import {currentGame} from 'auxiliary/route';

interface HelmetProps {
    page: string;
    props?: Record<string, string>;
}

//item
//home
//shop
//track
//success
//policy
//account
//register
//discount
//login

//blog
//post
//account

//login
//confirm
//forget
//register
//reset

//checkout

//contact
//policy
//about
//tos
//404
const title = {
    "item": (p: any) => `${p.name}`,
    "home": (p: any) => `${currentGame.name} premium boosting service!`,
    "shop": (p: any) => `Buy ${currentGame.name} service`,
    "track": (p: any) => `Track your ${currentGame.name} order`,
    "success": (p: any) => `You order is in progress`,
    "account": (p: any) => `Account`,
    "discount": (p: any) => `Discount`,

    "blog": (p: any) => `Blog`,
    "post": (p: any) => `${p.name}`,

    "login": (p: any) => `Login`,
    "confirm": (p: any) => `Confirm`,
    "forget": (p: any) => `Forget`,
    "register": (p: any) => `Registration`,
    "reset": (p: any) => `Reset password`,

    "checkout": (p: any) => `${currentGame.name} checkout`,

    "contact": (p: any) => `Contact us`,
    "policy": (p: any) => `Privacy policy`,
    "about": (p: any) => `About us`,
    "tos": (p: any) => `Terms of service`,
    "404": (p: any) => `Page not found`,
};

const Meta: React.FC<HelmetProps> = ({page, props = {}}) => {
    return (
        <Helmet>
            <title>Yo wassup</title>
        </Helmet>
    );
};

export default Meta;