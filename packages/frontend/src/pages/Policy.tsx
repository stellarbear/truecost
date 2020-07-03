import React from "react";
import TextCard from "./Base/TextCard";
import {text} from "assets/text";
import Meta from "./Base/Meta";

interface IPolicyProps {
}

const Policy: React.FC<IPolicyProps> = ({}): JSX.Element => {

    return (
        <React.Fragment>
            <Meta page="policy"/>
            <TextCard title="Privacy policy"
                      data={Object.keys(text.policy).map(key => ({title: key, text: text.policy[key]}))}/>
        </React.Fragment>
    );
};

export default Policy;
