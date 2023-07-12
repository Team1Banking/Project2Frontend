import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Spacer, Text, Input, Grid, Card } from '@nextui-org/react';

export default function Transfer() {
  const [recipientAccountId, setRecipientAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    const parsedToken = parseJwt(accessToken);
    if (parsedToken && parsedToken.Role === 'Account Holder') {
      setUserId(parsedToken.Id);
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const url = `http://localhost:8080/user/${userId}`;
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsers(
          response.data.map((user: any) => ({
            id: user.user_id,
            name: user.userName,
          }))
        );
        console.log('Users:', response.data);
      } catch (error) {
        console.error(error);
        setErrorMessage('Failed to fetch users.');
      }
    };

    if (userId) {
      fetchUsers();
    }
  }, [userId]);

  const handleTransfer = async () => {
    try {
      const url = 'http://localhost:8080/account/Transfer';

      const payload = {
        amount: parseInt(amount),
        recepientAcct: parseInt(recipientAccountId),
        senderAcct: parseInt(userId),
      };

      const accessToken = localStorage.getItem('accessToken');
      console.log('Payload:', payload);
      console.log('Access Token:', accessToken);

      const response = await axios.put(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setSuccessMessage('Transfer successful.');
      console.log('Response data:', response.data);
    } catch (error) {
      console.error(error);
      setErrorMessage('Transfer failed.');
    }
  };

  function parseJwt(token: any) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedToken = atob(base64);
      const parsedToken = JSON.parse(decodedToken);
      return parsedToken;
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return null;
    }
  }

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
            Transfer
          </Text>
        </Grid>
        <Grid xs={24} md={12}>
          <Card
            isHoverable
            className='flex-row justify-evenly'
            variant='bordered'
            css={{
              width: '30vw',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Card.Body>
              <Spacer y={1.6} />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Input
                  label='Recipient Account ID'
                  placeholder='Enter recipient account ID'
                  value={recipientAccountId}
                  onChange={(e) => setRecipientAccountId(e.target.value)}
                  width='250px' // Set the desired width
                />
              </div>
              <Spacer y={0.8} />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Input
                  label='Amount'
                  placeholder='Enter transfer amount'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  width='250px'
                />
              </div>
              <Spacer y={0.8} />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  color='gradient'
                  size='lg'
                  shadow
                  onClick={handleTransfer}
                >
                  Transfer
                </Button>
              </div>
              <Spacer y={1.6} />
              {errorMessage && (
                <Text color='error' style={{ textAlign: 'center' }}>
                  {errorMessage}
                </Text>
              )}
              {successMessage && (
                <Text color='success' style={{ textAlign: 'center' }}>
                  {successMessage}
                </Text>
              )}
            </Card.Body>
          </Card>
        </Grid>
      </Grid.Container>
    </>
  );
}
