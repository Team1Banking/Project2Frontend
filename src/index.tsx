import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import './index.css';
import App from './App';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import Sidebar from './components/Sidebar';
import ViewAccounts from './components/ViewAccounts';
import Withdraw from './components/Withdraw';
import Deposit from './components/Deposit';
import Transfer from './components/Transfer';
import RecentTransactions from './components/RecentTransactions';
import RegisterAccount from './components/RegisterAccount';
import Profile from './components/Profile';

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {},
  },
});

ReactDOM.render(
  <React.StrictMode>
    <NextUIProvider theme={darkTheme}>
      <NextThemesProvider>
        <Router>
          <Routes>
            <Route path='/' element={<App />} />
            <Route
              path='/*'
              element={
                <Sidebar>
                  <Routes>
                    <Route path='/home' element={<Home />} />
                    <Route path='/view-accounts' element={<ViewAccounts />} />
                    <Route path='/withdraw' element={<Withdraw />} />
                    <Route path='/deposit' element={<Deposit />} />
                    <Route path='/transfer' element={<Transfer />} />
                    <Route
                      path='/recent-transactions'
                      element={<RecentTransactions />}
                    />
                    <Route
                      path='/register-account'
                      element={<RegisterAccount />}
                    />
                    <Route path='/profile' element={<Profile />} />
                  </Routes>
                </Sidebar>
              }
            />
          </Routes>
        </Router>
      </NextThemesProvider>
    </NextUIProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
