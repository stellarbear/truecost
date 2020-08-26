import * as React from "react";
import TextCard from "./Base/TextCard";
import {text} from "assets/text";

export const TOS: React.FC = () => (
    <TextCard title="Terms of service"
        data={Object.keys(text.tos).map(key =>
            ({title: key, text: (text as any).tos[key]}))} />
);
