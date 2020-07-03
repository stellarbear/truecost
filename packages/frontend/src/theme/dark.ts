import {createMuiTheme} from "@material-ui/core";
import colors from "./colors";

const dark = createMuiTheme({
    typography: {
        fontFamily: '"Russo One"',
    },
    palette: {
        primary: {main: colors.primaryColor},
        secondary: {main: colors.accentColor},
        type: "dark",
    },
});

export default dark;
