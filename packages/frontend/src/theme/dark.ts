import {createMuiTheme, responsiveFontSizes} from "@material-ui/core";
import colors from "./colors";

const dark = responsiveFontSizes(
    createMuiTheme({
        spacing: 8,
        palette: {
            primary: {main: colors.primaryColor},
            secondary: {main: colors.accentColor},
            type: "dark",
        },
    }),
    {factor: 4});

export default dark;
