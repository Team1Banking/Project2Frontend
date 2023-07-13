/* eslint-disable @typescript-eslint/no-redeclare */
import React, { useState, useEffect } from 'react';
import { Text, Input, Button, Spacer } from '@nextui-org/react';
import axios, { AxiosError } from 'axios';
import Account from './ViewAccounts';

function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError;
}
interface Account {
  acctId: number;
  acctType: string;
  accoutValue: number;
}

interface DepositProps {
  accountId: number | undefined;
  account: Account | null;
  onUpdateBalance: (newBalance: number) => void;
}
export default function Deposit({
  accountId,
  account,
  onUpdateBalance,
}: DepositProps) {
  const [depositAmount, setDepositAmount] = useState(0);
  const [accountType, setAccountType] = useState('');
  const [userId, setUserId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDeposit = async () => {
    try {
      if (!accountId) {
        setErrorMessage('Account ID not found.');
        return;
      }

      console.log('Account ID:', accountId);
      console.log('Deposit Amount:', depositAmount);
      console.log('Account Type:', accountType);

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setErrorMessage('Access token not found.');
        return;
      }

      const response = await axios.put(
        `${process.env.REACT_APP_HOST_API_URL}/account/Deposit/${accountId}`,
        depositAmount,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Response:', response.data);

      setErrorMessage(null);

      if (account) {
        onUpdateBalance(account.accoutValue + depositAmount);
      }
    } catch (error) {
      console.error('Error:', error);
      if (isAxiosError(error) && error.response) {
        setErrorMessage(
          'Error occurred while processing your request. Please try again later.'
        );
      }
    }
  };

  function parseJwt(token: string) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedToken = atob(base64);
      const parsedToken = JSON.parse(decodedToken);
      console.log('Parsed JWT:', parsedToken);

      return parsedToken.Id || parsedToken.sub || null;
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return null;
    }
  }

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        const parsedUserId = parseJwt(accessToken);
        setUserId(parsedUserId);
      }
    }
  }, []);

  return (
    <>
      <div className='flex flex-row items-center justify-center '>
        <Text
          h1
          size={28}
          css={{
            textGradient: '45deg, $blue800 -20%, $purple800 100%',
          }}
          weight='bold'
        >
          Deposit
        </Text>
        {errorMessage && (
          <div>
            <Text color='error' css={{ textAlign: 'center' }} weight='bold'>
              {errorMessage}
            </Text>
          </div>
        )}
        <Spacer />
        <Input
          type='number'
          value={depositAmount}
          onChange={(e) =>
            setDepositAmount(Math.max(0, parseInt(e.target.value)))
          }
        />
        <Spacer />
        <Button onClick={handleDeposit}>Deposit</Button>
      </div>
    </>
  );
}
