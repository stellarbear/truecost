import {createMuiTheme, responsiveFontSizes} from "@material-ui/core";
import colors from "./colors";

const light = responsiveFontSizes(
    createMuiTheme({
        spacing: 8,
        typography: {
            fontFamily: '"Russo One", "Arial Black"',
        },
        palette: {
            primary: {main: colors.primaryColor},
            secondary: {main: colors.accentColor},
            type: "light",
        },
    }),
    {factor: 4});

export default light;
