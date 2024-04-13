import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

interface AlertState {
  open: boolean;
  message: string;
  severity: AlertProps['severity'];
}

interface AlertContextType {
  showAlert: (message: string, severity?: AlertState['severity']) => void;
  withErrorAlert: <T>(promise: () => Promise<T>, severity?: AlertState['severity']) => Promise<T>;
  withAlert: <T>(promise: () => Promise<T>, message: string, severity?: AlertState['severity']) => Promise<T>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
}

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export function AlertProvider({ children }: AlertProviderProps) {
  const [alert, setAlert] = useState<AlertState>({ open: false, message: '', severity: 'info' });

  const showAlert = useCallback((message: string, severity: AlertState['severity'] = 'info') => {
    setAlert({ open: true, message, severity });
  }, []);

  async function withErrorAlert<T>(promise: () => Promise<T>, severity: AlertState['severity'] = 'error'): Promise<T> {
    return promise().catch(error => {
      const message = error.message ? error.message : error;
      showAlert(message, severity); 
      return Promise.reject(error)
    });
  }

  async function withAlert<T>(promise: () => Promise<T>, message: string, severity: AlertState['severity'] = 'info'): Promise<T> {
    return promise().then((response) => {showAlert(message, severity); return Promise.resolve(response)});
  }

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const action = (
    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
      <Close fontSize="small" />
    </IconButton>
  );

  return (
    <AlertContext.Provider value={{ showAlert, withErrorAlert, withAlert }}>
      {children}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleClose}
        action={action}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert elevation={6} variant="filled" severity={alert.severity} onClose={handleClose}>
          {alert.message}
        </MuiAlert>
      </Snackbar>
    </AlertContext.Provider>
  );
};