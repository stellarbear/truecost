import React from "react";
import {text} from "assets/text";
import TextCard from "./Base/TextCard";
import Meta from "./Base/Meta";

interface IContactProps {
}

const Discount: React.FC<IContactProps> = ({}): JSX.Element => {

    return (
        <React.Fragment>
            <Meta page="discount"/>
            <TextCard title="Discount"
                      data={Object.keys(text.discount).map(key => ({title: key, text: text.discount[key]}))}/>
        </React.Fragment>
    );
};

export default Discount;
