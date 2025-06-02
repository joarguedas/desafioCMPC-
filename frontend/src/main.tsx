import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext'; // Asegúrate que el nombre coincida
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* ENVOLVER AQUÍ */}
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);