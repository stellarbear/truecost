import * as React from "react";
import TextCard from "./Base/TextCard";
import {text} from "assets/text";
import Meta from "./Base/Meta";

interface IAboutProps {
}

const About: React.FC<IAboutProps> = ({}): JSX.Element => {

    return (
        <React.Fragment>
            <Meta page="about" />
            <TextCard title="About us"
                data={Object.keys(text.about).map(key => ({title: key, text: (text as any).about[key]}))} />
        </React.Fragment>
    );
};

export default About;
