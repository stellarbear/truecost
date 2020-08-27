import * as React from "react";
import TextCard from "./Base/TextCard";
import {text} from "assets/text";
import {Meta} from "./Base/Meta";

export const About: React.FC = () => (
    <>
        <Meta />
        <TextCard title="About us"
            data={Object.keys(text.about).map(key => ({title: key, text: (text as any).about[key]}))} />
    </>
);
