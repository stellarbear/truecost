import {Button} from '@material-ui/core';
import {IGame} from '@truecost/shared';
import {RowSwipable} from 'pages/Base/Grid';
import {useStore} from 'pages/Data/Wrapper';
import ItemCard from 'pages/Shop/ItemCard';
import React from 'react';
import {Link} from 'react-router-dom';

interface IProps {
    game: IGame;
}

export const HomeGameTopOffers: React.FC<IProps> = (props) => {
    const {game} = props;
    const {current: {shop}, update: {setGame}} = useStore();
    const {items: {id: items}} = shop(game.id);
    const url = '/' + game.url;

    const top = Object.keys(items).filter(i => items[i].topOffer);

    if (top.length === 0) {
        return <div />;
    }

    return (
        <>
            <div style={{marginLeft: -16}}>
                <RowSwipable id={`${game.name} top offers`}
                    w={250} s={16} p={16} arrows>
                    {top.map(id => (
                        <ItemCard
                            noprice
                            gameUrl={game.url}
                            gameId={game.id}
                            key={id} id={id} />
                    ))}
                </RowSwipable>
            </div>
            <Button fullWidth
                onClick={() => setGame(game.id)}
                component={Link} to={url + "/shop"}
                style={{
                    margin: "-8px 0px 8px 0px",
                    padding: "16px",
                }}>
                Show more
            </Button>
        </>
    );
};