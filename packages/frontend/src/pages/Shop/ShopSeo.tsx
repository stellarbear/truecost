import {Accordion, AccordionDetails, AccordionSummary, Typography} from '@material-ui/core';
import {IGame} from '@truecost/shared';
import {Col} from 'pages/Base/Grid';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React from 'react';
import {Markdown} from 'components/Markdown';

interface IProps {
    game: IGame;
}

export const ShopSeo: React.FC<IProps> = (props) => {
    const {game} = props;

    if (!game.seo || game.seo.length === 0) {
        return null;
    }

    return <SeoText text={game.seo} />;
};

export const SeoText: React.FC<{text: string}> = (props) => {
    const {text} = props;

    const data = text
        .split('>>>')
        .filter(e => e && e.includes('\n'));

    return (
        <Col>
            {data.map((e, i) => {
                const index = e.indexOf('\n');
                const header = e.slice(0, index);
                const data = e.slice(index);

                return (
                    <Accordion key={i}>
                        <AccordionSummary style={{padding: "4px 16px"}}
                            expandIcon={<ExpandMore />}>
                            <Typography
                                variant="h6" component="h2" color="inherit">
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