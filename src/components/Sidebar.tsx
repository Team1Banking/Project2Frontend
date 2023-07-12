import React, { useEffect } from 'react';
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
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Avatar, Grid, Text, Spacer } from '@nextui-org/react';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AddCardIcon from '@mui/icons-material/AddCard';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, createContext } from 'react';
// import { useMemo } from 'react';
import Button from '@mui/material/Button';
import { openDB } from 'idb';
import profilePictureImage from './antUser.png';

// const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

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
})<AppBarProps>(({ theme, open }) => {
  return {
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
    '& .MuiIconButton-root': {
      color:
        theme.palette.mode === 'dark'
          ? theme.palette.primary.main
          : theme.palette.primary.contrastText,
    },
  };
});

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

interface ColorModeContextProps {
  toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextProps>({
  toggleColorMode: () => {},
});

interface MiniDrawerProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: MiniDrawerProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const accessToken = localStorage.getItem('accessToken');
  const [open, setOpen] = useState(false);
  // const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // const toggleColorMode = () => {
  //   setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  // };

  // const colorMode = useMemo(
  //   () => ({
  //     toggleColorMode: toggleColorMode,
  //   }),
  //   []
  // );

  const logout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const db = await openDB('myDB', 1, {
        upgrade(db) {
          db.createObjectStore('profilePictures');
        },
      });

      const transaction = db.transaction('profilePictures', 'readonly');
      const objectStore = transaction.objectStore('profilePictures');
      const request = objectStore.getAll();

      request.then((profilePictures) => {
        if (profilePictures && profilePictures.length > 0) {
          setProfilePicture(profilePictures[0].profilePicture);
        }
      });
    };

    fetchProfilePicture();
  }, []);

  // const saveProfilePicture = async (profilePicture: string) => {
  //   const db = await openDB('myDB', 1);
  //   const transaction = db.transaction('profilePictures', 'readwrite');
  //   const objectStore = transaction.objectStore('profilePictures');
  //   objectStore.clear();
  //   objectStore.add({ profilePicture });

  //   setProfilePicture(profilePicture);
  // };

  const SidebarItem: React.FC<{
    icon: React.ReactNode;
    text: string;
    to: string;
  }> = ({ icon, text, to }) => {
    return (
      <ListItem disablePadding component={Link} to={to}>
        <ListItemButton
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

  function parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    console.log('jsonPayload:', jsonPayload);
    return JSON.parse(jsonPayload);
  }

  console.log('accessToken:', accessToken);

  const user = accessToken ? parseJwt(accessToken) : null;

  useEffect(() => {
    const loadProfilePicture = async () => {
      const db = await openDB('myDatabase', 1, {
        upgrade(db) {
          db.createObjectStore('profiles');
        },
      });
      const tx = db.transaction('profiles', 'readonly');
      const store = tx.objectStore('profiles');
      const picture = await store.get(user?.sub || '');
      setProfilePicture(picture || null);
    };

    if (user) {
      loadProfilePicture();
    }
  }, [user]);

  return (
    // <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Drawer variant='permanent' open={open}>
          <div className='flex items-center justify-between '>
            <div>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'rtl' ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </div>
            <DrawerHeader></DrawerHeader>
          </div>
          <Divider />

          <Grid.Container gap={3}>
            <Grid>
              <Avatar
                key={profilePicture}
                css={{
                  mw: '600px',
                  height: open ? '22vh' : '2vh',
                  width: open ? '22vh' : '2vh',
                  transition: 'width 0.3s, height 0.3s',
                }}
                zoomed
                size='sm'
                src={profilePicture || profilePictureImage}
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
          </List>
          <Divider />
          <List>
            <SidebarItem
              icon={<ReceiptLongIcon />}
              text='Transfer'
              to='/transfer'
            />
            <Spacer y={0.5} />
            <SidebarItem
              icon={<ReceiptLongIcon />}
              text='All Transactions'
              to='/recent-transactions'
            />
            <Spacer y={0.5} />
            <SidebarItem
              icon={<AddCardIcon />}
              text='Add Bank Account'
              to='/register-account'
            />
            <Spacer y={0.5} />
            <SidebarItem
              icon={<AccountCircleIcon />}
              text='Update Profile'
              to='/profile'
            />
          </List>
        </Drawer>
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            p: 3,
            paddingTop: '64px',
            boxSizing: 'content-box',
          }}
        >
          <AppBar position='fixed' open={open}>
            <Toolbar className='bg-grey-900'>
              <div className='flex justify-center'>
                <IconButton
                  color='inherit'
                  aria-label='open drawer'
                  onClick={handleDrawerOpen}
                  edge='start'
                  sx={{
                    justifyContent: 'center',
                    marginRight: 5,
                    ...(open && { display: 'none' }),
                  }}
                >
                  <MenuIcon />
                </IconButton>

                <Spacer x={2} />
                <Text h1 size={25} css={{}} weight='thin' className='pt-2'>
                  {' '}
                  Welcome, {user.firstName} {user.lastName}!{' '}
                </Text>
              </div>
              <Button
                variant='contained'
                onClick={logout}
                color='secondary'
                sx={{ marginLeft: 'auto' }}
              >
                Logout
              </Button>
            </Toolbar>
          </AppBar>
          {children}
        </Box>
      </Box>
    </ThemeProvider>
    // </ColorModeContext.Provider>
  );
}
