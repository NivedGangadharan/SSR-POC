import { createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      // very dark primary color
      main: "#0b0b0b",
      contrastText: "#ffffff",
    },
    background: {
      default: "#000000",
      paper: "#0b0b0b",
    },
    text: {
      primary: "#ffffff",
      secondary: "#bdbdbd",
    },
  },
  typography: {
    fontFamily: 'Saira, Arial, Helvetica, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#000000",
          color: "#ffffff",
        },
      },
    },
  },
});

export default muiTheme;
