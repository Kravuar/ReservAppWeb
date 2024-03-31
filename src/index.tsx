import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { ruRU } from "@mui/x-date-pickers/locales";
import { AlertProvider } from "./components/util/Alert";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <LocalizationProvider
    localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
    dateAdapter={AdapterLuxon}
  >
    <AlertProvider>
      <App />
    </AlertProvider>
  </LocalizationProvider>
);
