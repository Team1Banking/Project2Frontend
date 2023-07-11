import React, { useEffect, useState, useCallback } from 'react';
import { Text, Grid, Card, Spacer, Table } from '@nextui-org/react';
import axios from 'axios';

interface Account {
  acctId: number;
  acctType: string;
  accoutValue: number;
}

interface Transaction {
  transactionId: number;
  amount: number;
  recepientAcct: number;
  senderAcct: number;
  transactionType: string;
  [key: string]: number | string;
}

export default function ViewAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [userId, setUserId] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const columns = [
    {
      key: 'transactionId',
      label: 'Transaction ID',
    },
    {
      key: 'amount',
      label: 'Amount',
    },
    {
      key: 'recepientAcct',
      label: 'Recipient Acct',
    },
    {
      key: 'senderAcct',
      label: 'Sender Acct',
    },
    {
      key: 'transactionType',
      label: 'Transaction Type',
    },
  ];

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
      fetchTransactions();
    }
  }, [userId]);

  const fetchTransactions = useCallback(async () => {
    try {
      const url = `http://localhost:8080/user/${userId}/All/Transactions`;
      const accessToken = localStorage.getItem('accessToken');

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setTransactions(response.data.slice(0, 5));
    } catch (error) {
      console.error(error);
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
      <Spacer />
      <Grid.Container gap={2} className='flex justify-center w-screen pt-5'>
        <Grid xs={12} md={6} lg={12}>
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
              h2
              size={40}
              css={{
                textGradient: '45deg, $pink600 -20%, $purple600 100%',
                textAlign: 'center',
              }}
              weight='bold'
            >
              Checking Accounts
            </Text>
            <Card.Body>
              {checkingAccounts.map((account) => (
                <div key={account.acctId} style={{ marginTop: '16px' }}>
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
              h2
              size={40}
              css={{
                textGradient: '45deg, $pink600 -20%, $purple600 100%',
                textAlign: 'center',
              }}
              weight='bold'
            >
              Savings Accounts
            </Text>
            <Card.Body>
              {savingsAccounts.map((account) => (
                <div key={account.acctId} style={{ marginTop: '16px' }}>
                  <Text>Account ID: {account.acctId}</Text>
                  <Text>Account Type: {account.acctType}</Text>
                  <Text>Account Balance: {account.accoutValue}</Text>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Grid>
        <Grid xs={24}>
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
              h2
              size={40}
              css={{
                textGradient: '45deg, $pink600 -20%, $purple600 100%',
                textAlign: 'center',
              }}
              weight='bold'
            >
              Recent Transactions
            </Text>
            <Card.Body>
              {transactions.length > 0 ? (
                <Table>
                  <Table.Header>
                    {columns.map((column) => (
                      <Table.Column allowsSorting key={column.key}>
                        {column.label}
                      </Table.Column>
                    ))}
                  </Table.Header>
                  <Table.Body>
                    {transactions.map((transaction) => (
                      <Table.Row key={transaction.transactionId}>
                        {columns.map((column) => (
                          <Table.Cell key={column.key}>
                            {transaction[column.key]}
                          </Table.Cell>
                        ))}
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              ) : (
                <Text>No transactions available.</Text>
              )}
            </Card.Body>
          </Card>
        </Grid>
      </Grid.Container>
    </>
  );
}
