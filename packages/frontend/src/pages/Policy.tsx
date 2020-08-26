import * as React from "react";
import TextCard from "./Base/TextCard";
import {text} from "assets/text";

export const Policy: React.FC = () => (
    <TextCard title="Privacy policy"
        data={Object.keys(text.policy).map(key =>
            ({title: key, text: (text as any).policy[key]}))} />
);
