import React, { useState, useEffect } from 'react';
import { Text, Input, Button } from '@nextui-org/react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedToken = atob(base64);
    const parsedToken = JSON.parse(decodedToken);
    return parsedToken.sub || parsedToken.Id || null;
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
}

export default function Withdraw() {
  const { id } = useParams();
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  const [accountType, setAccountType] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        const parsedUserId = parseJwt(accessToken);
        setUserId(parsedUserId);
      }
    }
  }, []);

  const handleWithdrawal = async () => {
    try {
      if (!userId) {
        console.error('User ID not found.');
        return;
      }

      console.log('User ID:', userId);
      console.log('Withdrawal Amount:', withdrawalAmount);
      console.log('Account Type:', accountType);

      const response = await axios.put(`http://localhost:8080/Withdraw/${id}`, {
        userId,
        accountType,
        withdrawalAmount,
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  console.log('Params ID:', id);
  console.log('Withdrawal Amount:', withdrawalAmount);
  console.log('Account Type:', accountType);
  console.log('User ID:', userId);

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
        Withdraw
      </Text>
      <div>
        <label>
          <input
            type='radio'
            value='checking'
            checked={accountType === 'checking'}
            onChange={() => setAccountType('checking')}
          />
          Checking
        </label>
        <label>
          <input
            type='radio'
            value='savings'
            checked={accountType === 'savings'}
            onChange={() => setAccountType('savings')}
          />
          Savings
        </label>
      </div>
      <Input
        type='number'
        value={withdrawalAmount}
        onChange={(e) => setWithdrawalAmount(parseInt(e.target.value))}
      />
      <Button onPress={handleWithdrawal}>Withdraw</Button>
    </>
  );
}
