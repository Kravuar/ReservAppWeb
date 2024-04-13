import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AlertProvider } from "./components/util/Alert";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const theme = createTheme({
  palette: {
    primary: {
      light: '#6a7ab7',
      main: '#345f9f',
      dark: '#2c4978',
      contrastText: '#fff',
    },
    secondary: {
      light: '#a2a2a2',
      main: '#757575',
      dark: '#494949',
      contrastText: '#fff',
    },
    success: {
      light: '#a5d6a7',
      main: '#4caf50',
      dark: '#388e3c',
      contrastText: '#fff',
    },
    warning: {
      light: '#ffe0b2',
      main: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#fff',
    },
    error: {
      light: '#ef9a9a',
      main: '#d32f2f',
      dark: '#c62828',
      contrastText: '#fff',
    },
    info: {
      light: '#64b5f6',
      main: '#1976d2',
      dark: '#115293',
      contrastText: '#fff',
    },
    grey: {
      50: '#fafafa',
      100: '#f0f0f0',
      200: '#e0e0e0',
      300: '#d1d1d1',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#808080',
      700: '#606060',
      800: '#404040',
      900: '#212121',
    },
    text: {
      primary: '#212121',
      secondary: '#5f6368',
      disabled: '#9e9e9e',
    },
    divider: '#d1d1d1',
    background: {
      default: '#fafafa',
      paper: '#fff',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  }
});

root.render(
  <ThemeProvider theme={theme}>
    <LocalizationProvider adapterLocale="ru" dateAdapter={AdapterLuxon}>
      <AlertProvider>
        <App />
      </AlertProvider>
    </LocalizationProvider>
  </ThemeProvider>
);
