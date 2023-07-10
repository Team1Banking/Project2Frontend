import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Spacer, Text, Input } from '@nextui-org/react';

export default function Transfer() {
  const [senderAccountId, setSenderAccountId] = useState('');
  const [recipientAccountId, setRecipientAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    const parsedToken = parseJwt(accessToken);
    if (parsedToken && parsedToken.Role === 'Account Holder') {
      setUserId(parsedToken.Id);
    }
  }, []);

  const handleTransfer = async () => {
    try {
      const url = `http://localhost:8080/account/Transfer`;

      const payload = {
        amount: parseInt(amount),
        recepientAcct: parseInt(recipientAccountId),
        senderAcct: parseInt(senderAccountId),
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
      <Text
        h1
        size={40}
        css={{
          textGradient: '45deg, $yellow600 -20%, $red600 100%',
        }}
        weight='bold'
      >
        Transfer
      </Text>
      <Spacer y={1.6} />
      <Input
        label='Sender Account ID'
        placeholder='Enter sender account ID'
        value={senderAccountId}
        onChange={(e) => setSenderAccountId(e.target.value)}
      />
      <Spacer y={0.8} />
      <Input
        label='Recipient Account ID'
        placeholder='Enter recipient account ID'
        value={recipientAccountId}
        onChange={(e) => setRecipientAccountId(e.target.value)}
      />
      <Spacer y={0.8} />
      <Input
        label='Amount'
        placeholder='Enter transfer amount'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Spacer y={0.8} />
      <Button auto color='gradient' size='lg' shadow onClick={handleTransfer}>
        Transfer
      </Button>
      <Spacer y={1.6} />
      {errorMessage && <Text color='error'>{errorMessage}</Text>}
      {successMessage && <Text color='success'>{successMessage}</Text>}
    </>
  );
}
