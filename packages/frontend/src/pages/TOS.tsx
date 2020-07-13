import * as React from "react";
import TextCard from "./Base/TextCard";
import {text} from "assets/text";
import Meta from "./Base/Meta";


interface ITOSProps {
}

const TOS: React.FC<ITOSProps> = ({}): JSX.Element => {

    return (
        <React.Fragment>
            <Meta page="tos"/>
            <TextCard title="Terms of service"
                      data={Object.keys(text.tos).map(key => ({title: key, text: (text as any).tos[key]}))}/>
        </React.Fragment>
    );
};

export default TOS;
