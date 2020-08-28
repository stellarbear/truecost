import * as React from "react";
import TextCard from "./Base/TextCard";
import {text} from "assets/text";
import {Meta} from "./Base/Meta";

export const Policy: React.FC = () => (
    <>
        <Meta/>
        <TextCard title="Privacy policy"
                  data={Object.keys(text.policy).map(key =>
                      ({title: key, text: (text as any).policy[key]}))}/>
    </>
);
