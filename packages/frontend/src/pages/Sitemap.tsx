import {Typography} from "@material-ui/core";
import * as React from "react";
import {Link} from "react-router-dom";
import {Col} from "./Base/Grid";
import {useStore} from "./Data/Wrapper";

const link = {
    textDecoration: "none",
    color: "inherit",
};

export const Sitemap: React.FC = () => {
    const {games: {id: games}, tags} = useStore();

    return (
        <Col s={8}>
            {Object.keys(games).map((gameId, index) => (
                <Col key={index}>
                    <Typography variant="h4">
                        <Link style={link} to={`/${games[gameId].url}`}>
                            {games[gameId].name}
                        </Link>
                    </Typography>
                    {(tags.gameId[gameId] ?? []).map((tag, index) => (
                        <Typography
                            key={index}>
                            <Link style={link} to={`/${games[gameId].url}/${tag.url}`}>
                                {tag.name}
                            </Link>
                        </Typography>
                    ))}
                </Col>
            ))}
        </Col>
    );
};
