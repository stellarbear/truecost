import * as React from 'react';
import {IItem} from "@truecost/shared";
import {useStore} from 'pages/Data/Wrapper';
import {Carousel} from 'components/Carousel';
import {backend} from 'auxiliary/route';
import {Dialog, IconButton} from '@material-ui/core';
import {Col} from 'pages/Base/Grid';
import {Youtube} from 'mdi-material-ui';

interface IProps {
    item: IItem;
}

export const ItemImage: React.FC<IProps> = (props) => {
    const {item} = props;
    const [open, setOpen] = React.useState(false);

    const {current: {shop}} = useStore();
    const {items} = shop();

    const image = (item: IItem) => `${backend.uri}/${item.id}/${item.images[0]}/u.png`;

    return (
        <div style={{position: "sticky", top: 70}}>
            <Col align="flex-start">
                <div style={{position: "relative"}}>
                    <Carousel alt={`${item.name}`}>
                        {[
                            image(item),
                            ...item.item.filter((id) => (id in items.id)).map((id) => image(items.id[id])),
                        ]}
                    </Carousel>
                    {item.youtube && (
                        <IconButton
                            style={{
                                position: "absolute",
                                right: 8,
                                bottom: 8,
                                color: "red",
                                zoom: 2.5,
                                padding: 4,
                            }}
                            onClick={() => setOpen(true)}>
                            <Youtube />
                        </IconButton>
                    )}
                </div>
                <Dialog onClose={() => setOpen(false)} open={open}>
                    <iframe
                        style={{
                            maxWidth: 600,
                            minWidth: 600,
                            aspectRatio: "16/9",
                        }}
                        className="optanon-category-3" frameBorder="0"
                        allowFullScreen={true} allow="encrypted-media" title="YouTube video player" width="100%"
                        height="100%" src={item.youtube} />
                </Dialog>
            </Col>
        </div>
    );
};
