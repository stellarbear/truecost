import React, {useState} from "react";
import {
    Chip,
    Divider,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelProps,
    ExpansionPanelSummary,
    Hidden,
    IconButton,
    Typography,
} from "@material-ui/core";
import {ExpandMore, FileCopy} from "@material-ui/icons";
import {copyToClipboard} from "auxiliary";
import {NotificationContext} from "components/wrappers";
import {SafeJSON} from "auxiliary/json";
import DefaultImage from "components/DefaultImage";
import {imageUri} from "auxiliary/route";
import Row from "./Row";

export type Order = {
    id: string;
    name: string;
    createdAt: number;
    details: string;
    metadata: string;
    preview: string[];
    status: string;
    history: string;
};

interface IOrderPanelProps extends Partial<ExpansionPanelProps> {
    order: Order;
}

const OrderPanel: React.FC<IOrderPanelProps> = ({
                                                    order,
                                                    ...rest
                                                }) => {
    const {notify} = React.useContext(NotificationContext);
    const [hovered, setHovered] = useState("");

    const renderOrderProps = (meta: Record<string, any>): React.ReactNode[] => {

        return Object.keys(meta).map(key => {
            let value = (Array.isArray(meta[key]) ? meta[key].join(", ") : meta[key]) || "—";
            const parsed = SafeJSON.parse(meta[key], undefined);

            if (parsed) {
                if (parsed && Array.isArray(parsed)) {
                    value = (parsed as any).join(", ");
                    value = value.length === 0 ? "—" : value;
                } else if (typeof parsed === "object") {
                    return renderOrderProps(parsed as any);
                }
            } else if (typeof value === "object") {
                return renderOrderProps(value as any);
            }

            return (<div key={`meta-${key}`}
                         onMouseEnter={() => setHovered(`${key}-${value}`)}
                         onMouseLeave={() => setHovered("")}
                         onClick={() => {
                             copyToClipboard(meta[key]);
                             notify("copied to clipboard");
                         }}>
                <Typography variant="caption" style={{opacity: 0.6}}>
                    {key}
                </Typography>
                <div
                    style={{display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer"}}>
                    <Typography variant="caption">
                        {value}
                    </Typography>
                    <IconButton color="primary" style={{
                        transform: "scale(0.7)", margin: "-24px 8px -8px 8px",
                        opacity: hovered === `${key}-${value}` ? 1.0 : 0.0,
                        transition: "all 0.3s",
                    }}>
                        <FileCopy/>
                    </IconButton>
                </div>
                <Divider style={{width: "100%", margin: "4px 0px"}}/>
            </div>);
        });
    };

    const renderOrder = () => {
        const {id, name, metadata, createdAt, details, status, preview} = order;

        const meta: any = {
            ["payment intent"]: name,
            ["order id"]: id,
            ["date"]: new Date(createdAt).toUTCString(),
            ...SafeJSON.parse(metadata, {}),
        };
        //meta.game = SafeJSON.parse(meta.game, {});

        const info = SafeJSON.parse(details, []);
        const total = info.reduce((acc: number, {quantity, amount}: any) => acc + Math.floor(quantity * amount / 100), 0);

        const label = status;
        const color = ["done", "refund"].includes(status) ? "primary" :
            ["awaiting for contact"].includes(status) ? "secondary" : "default";

        return (
            <ExpansionPanel style={{width: "100%"}} {...rest}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMore/>}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        flexWrap: "wrap-reverse",
                    }}>
                        <Chip label={label} color={color as any}/>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                        }}>
                            <Typography variant="caption"
                                        style={{whiteSpace: "nowrap", marginLeft: 4, opacity: 0.6, marginBottom: 4}}>
                                {new Date(createdAt).toUTCString()}
                            </Typography>
                            <Hidden smDown>
                                <Typography variant="caption" style={{whiteSpace: "nowrap", marginLeft: 4}}>
                                    {id}
                                </Typography>
                            </Hidden>
                        </div>
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div style={{display: "flex", flexDirection: "column", width: "100%", alignItems: "flex-end"}}>
                        {preview.length > 0 && (
                            <React.Fragment>
                                <Typography>Order result</Typography>
                                <div style={{width: "100%"}}>
                                    <Row id={`order-${id}-preview`}>
                                        {preview.map((c, i) =>
                                            <a target="_blank"
                                               href={`${imageUri("order", `${id}-${c}`, "img-600w.webp")}`}>
                                                <DefaultImage
                                                    key={`${id}-image-${i}-preview`}
                                                    srcSet={`${imageUri("order", `${id}-${c}`, "img-300w")} 300w`}
                                                    src={imageUri("order", `${id}-${c}`)}
                                                    style={{objectFit: "contain", maxWidth: 300}}/>
                                            </a>,
                                        )}
                                    </Row>
                                </div>
                            </React.Fragment>
                        )}
                        <Typography>Order information</Typography>
                        <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
                            {renderOrderProps(meta)}
                        </div>
                        <Typography style={{marginTop: 16}}>Deliverable goods</Typography>
                        <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
                            {info.map(({description, amount, quantity}: any, i: number) => (
                                <div key={`info-${i}`}>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        width: "100%",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}>
                                        <div style={{display: "flex", flexDirection: "column"}}>
                                            {(description || "").split(',').map((d: string, j: number) => (
                                                <Typography key={`info-${i}-${j}`} variant="caption"
                                                            style={{opacity: j == 0 ? 1 : 0.6}}>
                                                    {d}
                                                </Typography>
                                            ))}
                                        </div>

                                        <div style={{display: "flex", minWidth: 80}}>
                                            <Typography variant="caption" style={{whiteSpace: "nowrap"}}>
                                                {`x ${quantity}`}
                                            </Typography>
                                            <Typography variant="caption" style={{
                                                whiteSpace: "nowrap", textAlign: "right",
                                                width: "100%",
                                            }}>
                                                {`${Math.floor(amount / 100)} $`}
                                            </Typography>
                                        </div>
                                    </div>
                                    <Divider style={{width: "100%", margin: "4px 0px"}}/>
                                </div>
                            ))}
                        </div>
                        <Typography style={{marginTop: 16}}>{`Total: ${total} $`}</Typography>
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    };

    return (
        <React.Fragment>
            {renderOrder()}
        </React.Fragment>
    );
};

export default OrderPanel;
