import * as React from "react";
import TextCard from "./Base/TextCard";
import {text} from "assets/text";

export const About: React.FC = () => (
    <TextCard title="About us"
        data={Object.keys(text.about).map(key => ({title: key, text: (text as any).about[key]}))} />
);
