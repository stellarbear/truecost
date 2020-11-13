import React from "react";
import {ButtonBase, Hidden} from "@material-ui/core";
import ChevronRight from '@material-ui/icons/ChevronRight';
import {shuffle} from "@truecost/shared";
import {Col, Row, RowSwipable} from "./Grid";
import {useStore} from "pages/Data/Wrapper";

const url = "https://www.trustpilot.com/review/truecost.gg?stars=5";

interface IProps {
    style?: React.CSSProperties;
}

export const TrustPanel: React.FC<IProps> = ({style = {}}) => {
    const {reviews} = useStore();

    if (reviews.length < 3) {
        return null;
    }

    const data = shuffle(Object.keys(reviews).map((e) => parseInt(e, 10)))
        .slice(0, 3).map(i => reviews[i]);

    return (
        <div style={style}>
            <a target="_blank" rel="noreferrer"
                style={{
                    width: "100%", height: "100%",
                    textDecoration: "none",
                    color: "#000",
                    fontSize: 12,
                    fontFamily: "'Roboto',Arial",
                    fontWeight: 14,
                }}
                href={url}>
                <ButtonBase>
                    <Col>
                        <Row fullWidth justify="space-between" style={{
                            height: 32,
                            paddingBottom: 13,
                            borderBottom: "1px solid #000",
                            marginBottom: 35,
                        }}>
                            <Row s={8} align="center">
                                <img height={32} src="/tp/logo.svg" alt="Trustpilot" />
                                <p style={{
                                    paddingTop: 17,
                                }}>TrustScore <strong>4.8 / 5</strong></p>
                            </Row>
                            <Hidden smDown>
                                <Row align="center" style={{
                                    marginTop: 12,
                                }}>
                                    <div
                                        style={{
                                            textTransform: "uppercase",
                                            fontWeight: 800,
                                            color: "#000",
                                        }}>ALL reviews </div>
                                    <ChevronRight />
                                </Row>
                            </Hidden>
                        </Row>
                        <RowSwipable id="tp" w={250} s={16}>
                            {data.map(({who, text, title}, index) => (
                                <Col key={index} align="flex-start">
                                    <img height={32} src="/tp/stars.svg" alt="star" />
                                    <p style={{
                                        fontSize: 14,
                                        fontFamily: "'Roboto',Arial",
                                    }}><strong>{title}</strong></p>
                                    <p style={{
                                        wordBreak: "break-word",
                                        fontSize: 13,
                                        textAlign: "left",
                                        fontFamily: "'Roboto',Arial",
                                    }}>{text}</p>
                                    <p style={{
                                        fontSize: 14,
                                        fontFamily: "'Roboto',Arial",
                                    }}><strong>{who}</strong></p>
                                </Col>
                            ))}
                        </RowSwipable>
                    </Col>
                </ButtonBase>
            </a>
        </div>
    );
};