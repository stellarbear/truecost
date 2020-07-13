import React from "react";
import ItemCard from "./ItemCard";
import Row from "./Row";

interface ItemRowProps {
    id: string;
    items: string[];
}

const ItemRow: React.FC<ItemRowProps> = ({
                                             id,
                                             items,
                                         }) => {
    if (items.length === 0) {
        return null;
    }

    return (
        <Row id={id}>
            {
                items.map(id => (
                    <div key={id} style={{margin: "0px 8px"}}>
                        <ItemCard id={id}/>
                    </div>
                ))
            }
        </Row>
    );
};

export default ItemRow;
