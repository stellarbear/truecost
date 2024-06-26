import React, {useState} from "react";
import {Button, Divider, IconButton, Typography} from "@material-ui/core";
import colors from "theme/colors";
import {text} from "assets/text";
import {social} from "auxiliary/social";
import TextCard from "./Base/TextCard";
import SocialDialog from "./Base/SocialDialog";
import {TrustPanel} from "./Base/TrustPanel";
import {Meta} from "./Base/Meta";

export const Contact: React.FC = () => {
    const [hovered, setHovered] = useState("");

    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "TrueCost",
        "url": "https://truecost.gg/",
        "logo": "https://truecost.gg/logo-black.png",
        "sameAs": social.map(s => `${s.url}`),
    };

    return (
        <>
            <Meta>
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            </Meta>
            <TextCard title="Contact us" data={[{
                title: null,
                text: text.contact,
            }]}>
                <React.Fragment>
                    <Divider style={{margin: "16px 0px"}} />
                    <div style={{
                        display: "flex", flexWrap: "wrap", justifyContent: "space-evenly",
                    }}>
                        {
                            social.map((item, index) => (
                                <div key={`social-${index}`} style={{
                                    display: "flex", flexDirection: "column", alignItems: "center",
                                }}
                                    onMouseEnter={() => setHovered(item.title)}
                                    onMouseLeave={() => setHovered("")}>
                                    <SocialDialog key={`social-${index}`} button={
                                        (
                                            <Button variant="contained" size="medium">
                                                {React.cloneElement(item.icon, {
                                                    style: {
                                                        color: hovered === item.title ? colors.primaryColor : "black",
                                                        transform: "scale(2)", padding: 24,
                                                        transition: "all 0.2s linear",
                                                    },
                                                })}
                                            </Button>
                                        )
                                    } {...item} />

                                    <Typography style={{
                                        color: hovered === item.title ? colors.primaryColor : "black",
                                        transition: "all 0.2s linear",
                                    }}>{item.title}</Typography>
                                </div>
                            ))
                        }
                    </div>
                </React.Fragment>
            </TextCard>
            <TextCard title="About us"
                data={Object.keys(text.about).map(key => ({title: key, text: (text as any).about[key]}))} />
            <TrustPanel style={{marginTop: 24}} />
        </>
    );
};
