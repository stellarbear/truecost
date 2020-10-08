import * as React from "react";
import {Divider, Typography} from "@material-ui/core";
import {Col} from "./Grid";

interface IProps {
    title: string;
    data?: {
        title: string | null;
        text: string;
    }[];
}

const TextCard: React.FC<IProps> = ({title, data = [], children}) => (
    <Col s={16}>
        <Typography variant="h4" component="h1"
                    style={{textAlign: "left", marginTop: 16, marginBottom: 16}}>{title}</Typography>
        <Divider/>
        {
            data.map(({title, text}, i) => (
                <div key={`block-${i}`}>
                    <Typography variant="h6" style={{marginTop: 16}}>{title}</Typography>
                    {text.split('\n').filter(c => c.length > 0).map((block, j) => (
                        <Typography variant="body2"
                                    key={`block-${i}-p-${j}`}> {block}</Typography>
                    ))}
                </div>
            ))
        }
        {children}
    </Col>
);

export default TextCard;
