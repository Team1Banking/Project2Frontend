import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid, Input, Text, Button, Spacer, Image } from '@nextui-org/react';
import CardLogin from './CardLogin';
import Register from './Register';
import Tilt from 'react-parallax-tilt';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [, setVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [checkingSelected, setCheckingSelected] = useState(false);
  const [savingsSelected, setSavingsSelected] = useState(false);
  const [modalUsername, setModalUsername] = useState('');
  const [modalPassword, setModalPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [, setAccountMessage] = useState('');

  const navigate = useNavigate();

  const login = async () => {
    const credentials = { username, password };
    console.log(credentials);
    try {
      const loginUrl = `${process.env.REACT_APP_HOST_API_URL}/auth/login`;
      if (!loginUrl) {
        throw new Error('LOGIN URL is not defined.');
      }

      const response = await axios.post(loginUrl, credentials);

      const { accessToken, ...userData } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userData', JSON.stringify(userData));

      const parsedToken = parseJwt(accessToken);
      console.log(parsedToken);
      if (parsedToken.Role === 'Account Holder') {
        setUserId(parsedToken.Id);
        navigate('/view-accounts');
      } else {
        setErrorMessage('Please register an account.');
      }
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        const { status } = error.response;
        if (status === 401) {
          setErrorMessage('Invalid username or password. Please try again.');
        } else {
          setErrorMessage('An error occurred. Please try again later.');
        }
      } else {
        setErrorMessage(
          'An error occurred. Please check your internet connection and try again.'
        );
      }
    }
  };

  const banklogin = async () => {
    const credentials = { username: modalUsername, password: modalPassword };
    console.log(credentials);
    try {
      const loginUrl = `${process.env.REACT_APP_HOST_API_URL}/auth/login`;
      if (!loginUrl) {
        throw new Error('LOGIN URL is not defined.');
      }

      const response = await axios.post(loginUrl, credentials);

      const accessToken = response.data.accessToken;
      localStorage.setItem('accessToken', accessToken);

      const parsedToken = parseJwt(accessToken);
      console.log(parsedToken);
      if (parsedToken.Role === 'Account Holder') {
        setUserId(parsedToken.Id);
        setStep(2);
      } else {
        setErrorMessage('Please register an account.');
      }
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        const { status } = error.response;
        if (status === 401) {
          setErrorMessage('Invalid username or password. Please try again.');
        } else {
          setErrorMessage('An error occurred. Please try again later.');
        }
      } else {
        setErrorMessage(
          'An error occurred. Please check your internet connection and try again.'
        );
      }
    }
  };

  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
    setStep(1);
    setModalUsername('');
    setModalPassword('');
    setCheckingSelected(false);
    setSavingsSelected(false);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      navigate('/view-accounts');
    }
  }, [navigate]);

  function parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  const createAccount = async () => {
    try {
      const url = `${process.env.REACT_APP_HOST_API_URL}/account/${userId}/register`;
      const accountType = checkingSelected
        ? 'Checking'
        : savingsSelected
        ? 'Savings'
        : '';

      const payload = {
        acctType: accountType,
      };

      const accessToken = localStorage.getItem('accessToken');

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };

      console.log('Request payload:', payload);

      const response = await axios.post(url, payload, { headers });

      setAccountMessage('Account created successfully.');
      console.log('Response data:', response.data);
    } catch (error) {
      console.error(error);
      setAccountMessage('Account could not be created.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100vh',
      }}
    >
      <Grid.Container gap={2} justify='center' style={{ marginTop: '70px' }}>
        <Grid direction='column'>
          <Spacer y={5} />

          <Image
            className='flex'
            showSkeleton
            width={680}
            height={280}
            maxDelay={10000}
            src='https://raw.githubusercontent.com/Team1Banking/Project2Frontend/main/src/ant-high-resolution-logo-color-on-transparent-background_(4).png'
            alt='Ant Logo'
          />

          <Spacer y={2} />
          <div>
            <div className='flex row-auto'>
              <Input
                clearable
                bordered
                size='xl'
                value={username}
                labelPlaceholder='Username'
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Spacer y={2.5} />
              <Input.Password
                clearable
                bordered
                size='xl'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                labelPlaceholder='Password'
                required
              />
              <Spacer y={1.6} />
              {step === 1 ? (
                <Button auto color='gradient' size='lg' shadow onPress={login}>
                  LOGIN
                </Button>
              ) : (
                <Button
                  auto
                  color='gradient'
                  size='lg'
                  shadow
                  onPress={banklogin}
                >
                  CONTINUE
                </Button>
              )}
            </div>
            <Spacer y={2} />
            <div className='flex'>
              <Register />
            </div>
          </div>
          <Spacer y={1.6} />
          {errorMessage && (
            <div style={{ textAlign: 'center' }}>
              <Text color='#ff0000'>{errorMessage}</Text>
            </div>
          )}
          <Spacer />
        </Grid>
        <Spacer x={3} />

        <div style={{ width: '475px', marginTop: '75px' }}>
          <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4}>
            <CardLogin />
          </Tilt>
        </div>
      </Grid.Container>
    </div>
  );
}
