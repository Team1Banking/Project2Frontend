import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Button, Spacer, Text, Card } from '@nextui-org/react';
import './Profile.css';

export default function RegisterAccount() {
  const [accountType, setAccountType] = useState('');
  const [userId, setUserId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access token:', accessToken);
    if (accessToken) {
      const parsedToken = parseJwt(accessToken);
      setUserId(parsedToken.Id);
    }
  }, []);

  function parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    console.log('base64Url:', base64Url);
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    console.log('base64:', base64);
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    console.log('jsonPayload:', jsonPayload);

    return JSON.parse(jsonPayload);
  }

  const handleAccountTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setAccountType(event.target.value);
  };

  const createAccount = async () => {
    try {
      console.log('userId:', userId);
      const url = `http://localhost:8080/account/${userId}/register`;

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

      console.log('Response data:', response.data);
      setSuccessMessage('Account created successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to create account.');
      setSuccessMessage('');
    }
  };

  return (
    <>
      <Spacer />
      <Grid.Container
        gap={2}
        direction='column'
        alignContent='center'
        alignItems='center'
        justify='center'
      >
        <Grid>
          <Text
            h1
            size={40}
            css={{
              textGradient: '45deg, $blue800 -20%, $purple800 100%',
            }}
            weight='bold'
          >
            Add Account
          </Text>
        </Grid>
        <Grid xs={24} md={12}>
          <Card
            isHoverable
            className='flex-row justify-evenly'
            variant='bordered'
            css={{
              width: '20vw',
              background: 'rgba(255, 255, 255, 0.039)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Card.Body>
              <Spacer y={0.8} />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <select
                  className=' glass-background'
                  value={accountType}
                  onChange={handleAccountTypeChange}
                >
                  <option value=''>Select Account Type</option>
                  <option value='Checking'>Checking</option>
                  <option value='Savings'>Savings</option>
                </select>
              </div>
              <Spacer y={2} />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  auto
                  color='gradient'
                  size='lg'
                  shadow
                  disabled={!accountType}
                  onPress={createAccount}
                >
                  SUBMIT
                </Button>
              </div>
              <Spacer y={1.6} />
              {successMessage && (
                <Text
                  color='success'
                  className='flex items-center justify-center'
                >
                  {successMessage}
                </Text>
              )}
              {errorMessage && (
                <Text
                  color='error'
                  className='flex items-center justify-center'
                >
                  {errorMessage}
                </Text>
              )}
            </Card.Body>
          </Card>
        </Grid>
      </Grid.Container>
    </>
  );
}
