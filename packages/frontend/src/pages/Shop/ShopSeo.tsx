import {Accordion, AccordionDetails, AccordionSummary, Typography} from '@material-ui/core';
import {IGame} from '@truecost/shared';
import Markdown from 'markdown-to-jsx';
import {Col} from 'pages/Base/Grid';
import React from 'react';

interface IProps {
    game: IGame;
}

export const ShopSeo: React.FC<IProps> = (props) => {
    const {game} = props;

    if (!game.seo || game.seo.length === 0) {
        return null;
    }

    const data = game.seo
        .split('>>>')
        .filter(e => e && e.includes('\n'));

    return (
        <Col>
            {data.map((e, i) => {
                const index = e.indexOf('\n');
                const header = e.slice(0, index);
                const data = e.slice(index);

                return (
                    <Accordion key={i}
                        style={{
                            fontFamily: "Roboto",
                        }}>
                        <AccordionSummary style={{padding: "4px 16px"}}>
                            <Typography
                                variant="h6" component="p" color="inherit">
                                {header}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Markdown style={{opacity: 0.7}}>
                                {data}
                            </Markdown>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </Col>
    );
};