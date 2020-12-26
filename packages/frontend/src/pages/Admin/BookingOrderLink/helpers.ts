import {SafeJSON} from "@truecost/shared";

export const dataDefault = `[
    {
        "amount":75,
        "quantity":1,
        "name":"Crucible glory",
        "description":"1040 -> 1080"
    },{
        "amount":10,
        "quantity":10,
        "name":"PVE kills",
        "description":"no options"
    }
]
`;

export const infoDefault = `{
    "platform":["XBOX","PC","PlayStation"],
    "text":"Some text about order",
    "cross":true
}
`;

export const infoValidate = (value: string) => {
    const parsed: any = SafeJSON.parse(value, null);
    if (parsed === null || typeof parsed !== "object") {
        return false;
    }

    const mapping = {
        text: (v: string) => typeof v === "string",
        cross: (v: string) => typeof v === "boolean",
        platform: (v: string) => Array.isArray(v) &&
            !v.some(e => typeof e !== "string"),
    };

    for (const key in parsed) {
        if (!(key in mapping)) {
            return false;
        }
        if (!(mapping as any)[key](parsed[key])) {
            return false;
        }
    }

    return true;
};

export const dataValidate = (value: string) => {
    const parsed: any = SafeJSON.parse(value, null);
    if (parsed === null || !Array.isArray(parsed)) {
        return false;
    }

    const mapping = {
        amount: (v: string) => typeof v === "number",
        quantity: (v: string) => typeof v === "number",
        name: (v: string) => typeof v === "string",
        description: (v: string) => typeof v === "string",
    };

    for (const entry of parsed) {
        if (typeof entry !== "object") {
            return false;
        }

        for (const key in mapping) {
            if (!(key in entry)) {
                return false;
            }
        }

        for (const key in entry) {
            if (!(key in mapping)) {
                return false;
            }
            if (!(mapping as any)[key](entry[key])) {
                return false;
            }
        }
    }

    return true;
};