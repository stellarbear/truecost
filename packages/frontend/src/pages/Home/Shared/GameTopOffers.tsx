import {Button, Hidden} from '@material-ui/core';
import {IGame} from '@truecost/shared';
import {RowGrid, RowSwipable} from 'pages/Base/Grid';
import {useStore} from 'pages/Data/Wrapper';
import ItemCard from 'pages/Shop/ItemCard';
import React from 'react';
import {Link} from 'react-router-dom';

interface IProps {
    game: IGame;
}

export const GameTopOffers: React.FC<IProps> = (props) => {
    const {game} = props;
    const {current: {shop}, update: {setGame}} = useStore();
    const {items: {id: items}} = shop(game.id);
    const url = '/' + game.url;

    const top = Object.keys(items).filter(i => items[i].topOffer);

    if (top.length === 0) {
        return <div />;
    }

    const renderItems = () => (
        top.slice(0, 12).map(id => (
            <ItemCard
                ordered
                gameUrl={game.url}
                gameId={game.id}
                key={id} id={id} />
        ))
    );

    return (
        <>
            <div style={{marginBottom: 16}}>
                <Hidden smDown>
                    <RowGrid
                        w={250} s={16} p={16}>
                        {renderItems()}
                    </RowGrid>
                </Hidden>
                <Hidden mdUp>
                    <RowSwipable
                        noArrows
                        w={250} s={16} p={16}
                        style={{margin: -16}}
                        id={`${game.url} top offers`}>
                        {renderItems()}
                    </RowSwipable>
                </Hidden>
            </div>
            <Button fullWidth
                variant="contained"
                onClick={() => setGame(game.id)}
                component={Link} to={url + "/shop"}
                style={{
                    backgroundColor: "#fafafa",
                    margin: "0px 0px 16px 0px",
                    padding: "16px",
                }}>
                Show more
            </Button>
        </>
    );
};