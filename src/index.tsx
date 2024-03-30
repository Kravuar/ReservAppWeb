import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { ruRU } from '@mui/x-date-pickers/locales';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <LocalizationProvider localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText} dateAdapter={AdapterLuxon}>
        <App/>
    </LocalizationProvider>
);
