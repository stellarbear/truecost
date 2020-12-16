import React, {useState} from 'react';
import {Button, Menu, MenuItem, Typography} from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import {Currencies, CurrencyKey} from '@truecost/shared';
import {useStore} from 'pages/Data/Wrapper';
import {Row} from 'pages/Base/Grid';
import {Circle} from 'components';

interface IProps {
    style?: React.CSSProperties;
}

export const CurrencyPicker: React.FC<IProps> = (props) => {
    const {style} = props;
    const {currency, update: {setCurrency}} = useStore();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    return (
        <>
            <Button
                style={style}
                color="inherit"
                aria-haspopup="true"
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                <Row align="center">
                    <Typography variant="h6" style={{whiteSpace: "nowrap"}}>
                        {currency.label}
                    </Typography>
                    <ArrowDropDown />
                </Row>
            </Button>
            <Menu
                anchorEl={anchorEl}
                disableScrollLock
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                {(
                    Object.keys(Currencies) as Array<CurrencyKey>
                ).map((id) => (
                    <MenuItem
                        key={id}
                        value={id}
                        onClick={() => setCurrency(id)}>
                        <Row s={8} align="center">
                            <strong>{`${Currencies[id].label} `}</strong>
                            <div>
                                {`${id.toLocaleUpperCase()}`}
                            </div>
                            {(id === currency.id) && <Circle />}
                        </Row>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};
