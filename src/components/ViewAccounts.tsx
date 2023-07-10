import React, { useEffect, useState } from 'react';
import { Text, Grid, Card } from '@nextui-org/react';
import axios from 'axios';

interface Account {
  acctId: number;
  acctType: string;
  accoutValue: number;
}

export default function ViewAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const parsedToken = parseJwt(accessToken);
    if (parsedToken && parsedToken.Role === 'Account Holder') {
      setUserId(parsedToken.Id);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchAccounts = async () => {
        const url = `http://localhost:8080/user/${userId}`;
        const accessToken = localStorage.getItem('accessToken');

        try {
          const response = await axios.get<Account[]>(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const filteredAccounts = response.data.filter(
            (account) =>
              account.acctType === 'Checking' || account.acctType === 'Savings'
          );

          setAccounts(filteredAccounts);
        } catch (error) {
          console.error(error);
        }
      };

      fetchAccounts();
    }
  }, [userId]);

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

  const checkingAccounts = accounts.filter(
    (account) => account.acctType === 'Checking'
  );

  const savingsAccounts = accounts.filter(
    (account) => account.acctType === 'Savings'
  );

  return (
    <>
      <Text
        h1
        size={40}
        css={{
          textGradient: '45deg, $yellow600 -20%, $red600 100%',
          paddingTop: '32px',
          marginBottom: '16px',
        }}
        weight='bold'
      >
        View Accounts
      </Text>
      <Grid.Container gap={2} justify='center' direction='row'>
        <Grid xs={12} md={6}>
          <Card
            isHoverable
            variant='bordered'
            css={{
              height: '400px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Text
              h1
              css={{
                textGradient: '45deg, $yellow600 -20%, $red600 100%',
                textAlign: 'center',
                marginBottom: '16px',
              }}
              weight='bold'
            >
              Checking Accounts
            </Text>
            <Card.Body>
              {checkingAccounts.map((account) => (
                <div
                  key={account.acctId}
                  style={{
                    marginTop: '16px',
                  }}
                >
                  <Text>Account ID: {account.acctId}</Text>
                  <Text>Account Type: {account.acctType}</Text>
                  <Text>Account Balance: {account.accoutValue}</Text>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Grid>
        <Grid xs={12} md={6}>
          <Card
            isHoverable
            variant='bordered'
            css={{
              height: '400px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Text
              h1
              css={{
                textGradient: '45deg, $yellow600 -20%, $red600 100%',
                textAlign: 'center',
                marginBottom: '16px',
              }}
              weight='bold'
            >
              Savings Accounts
            </Text>
            <Card.Body>
              {savingsAccounts.map((account) => (
                <div
                  key={account.acctId}
                  style={{
                    marginTop: '16px',
                  }}
                >
                  <Text>Account ID: {account.acctId}</Text>
                  <Text>Account Type: {account.acctType}</Text>
                  <Text>Account Balance: {account.accoutValue}</Text>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Grid>
      </Grid.Container>
    </>
  );
}
