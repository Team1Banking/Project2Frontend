import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

const lightTheme = createTheme({
  type: 'light',
  theme: {
    colors: {},
  },
});

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {},
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <NextThemesProvider
    defaultTheme='system'
    attribute='class'
    value={{
      light: lightTheme.className,
      dark: darkTheme.className,
    }}
  >
    <NextUIProvider>
      <React.StrictMode>
        <Router>
          <Routes>
            <Route path='/' element={<App />} />
            <Route path='/accountHolder' element={<MainPage />} />
          </Routes>
        </Router>
      </React.StrictMode>
    </NextUIProvider>
  </NextThemesProvider>
);

reportWebVitals();
