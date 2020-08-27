import * as React from "react";
import TextCard from "./Base/TextCard";
import {text} from "assets/text";
import {Meta} from "./Base/Meta";

export const TOS: React.FC = () => (
    <>
        <Meta />
        <TextCard title="Terms of service"
            data={Object.keys(text.tos).map(key =>
                ({title: key, text: (text as any).tos[key]}))} />
    </>
);
