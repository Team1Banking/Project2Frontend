import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Avatar, Grid, Text } from '@nextui-org/react';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentsIcon from '@mui/icons-material/Payments';
import { Link } from 'react-router-dom';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AddCardIcon from '@mui/icons-material/AddCard';
import PaidIcon from '@mui/icons-material/Paid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface MiniDrawerProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: MiniDrawerProps) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const SidebarItem: React.FC<{
    icon: React.ReactNode;
    text: string;
    to: string;
  }> = ({ icon, text, to }) => {
    return (
      <ListItem disablePadding>
        <ListItemButton
          component={Link}
          to={to}
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar position='fixed' open={open}>
          <Toolbar>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawerOpen}
              edge='start'
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant='permanent' open={open}>
          <DrawerHeader>
            <div className='flex justify-center'>
              <Text
                h1
                size={20}
                css={{
                  paddingLeft: '20px',
                  paddingTop: '10px',
                  textGradient: '45deg, $purple600 -20%, $blue600 100%',
                }}
                weight='bold'
              >
                MAD-J
              </Text>
            </div>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <Grid.Container gap={3}>
            <Grid>
              <Avatar
                css={{
                  mw: '600px',
                  height: open ? '22vh' : '2vh',
                  width: open ? '22vh' : '2vh',
                  transition: 'width 0.3s, height 0.3s',
                }}
                zoomed
                size='sm'
                src='https://media.istockphoto.com/id/1262964459/photo/nothing-is-a-magnet-for-success-like-self-confidence.webp?b=1&s=170667a&w=0&k=20&c=MGoEpHkz63VRhAPZ44dFAuAmRC0QAseAc6srOQKHDbw='
                alt='account holder'
                color='gradient'
                bordered
                className='flex mx-auto rounded-full md:w-full cursor-none'
                pointer
              />
            </Grid>
          </Grid.Container>
          <List>
            <SidebarItem
              icon={<AccountBalanceIcon />}
              text='View Accounts'
              to='/view-accounts'
            />
            <SidebarItem
              icon={<PaymentsIcon />}
              text='Withdraw'
              to='/withdraw'
            />
            <SidebarItem icon={<PaidIcon />} text='Deposit' to='/deposit' />
            <SidebarItem
              icon={<CurrencyExchangeIcon />}
              text='Transfer'
              to='/transfer'
            />
          </List>
          <Divider />
          <List>
            <SidebarItem
              icon={<ReceiptLongIcon />}
              text='Recent Transactions'
              to='/recent-transactions'
            />
            <SidebarItem
              icon={<AddCardIcon />}
              text='Register Account'
              to='/register-account'
            />
            <SidebarItem
              icon={<AccountCircleIcon />}
              text='Profile'
              to='/profile'
            />
          </List>
        </Drawer>
        <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
