import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Text, Table } from '@nextui-org/react';

interface Transaction {
  transactionId: number;
  amount: number;
  recepientAcct: number;
  senderAcct: number;
  transactionType: string;
  [key: string]: number | string;
}

export default function Expenses() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    const parsedToken = parseJwt(accessToken);
    if (parsedToken && parsedToken.Role === 'Account Holder') {
      setUserId(parsedToken.Id);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const url = `${process.env.REACT_APP_HOST_API_URL}/account/${userId}/All/Transactions/Expenses`;
      const accessToken = localStorage.getItem('accessToken');

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const uniqueTransactions = response.data.filter(
        (transaction: Transaction, index: number, self: Transaction[]) =>
          self.findIndex(
            (t) => t.transactionId === transaction.transactionId
          ) === index
      );

      setTransactions(uniqueTransactions);
      console.log('Transactions:', uniqueTransactions);
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to fetch transactions.');
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchTransactions();
    }
  }, [userId, fetchTransactions]);

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

  return (
    <>
      <Text
        h2
        size={40}
        css={{
          textGradient: '45deg, $blue800 -20%, $purple800 100%',
          textAlign: 'center',
        }}
        weight='bold'
      >
        Expenses
      </Text>

      {errorMessage && <Text color='error'>{errorMessage}</Text>}

      {transactions.length > 0 ? (
        <div style={{ overflowX: 'auto' }} className='h-full'>
          <Table
            aria-label='Transactions table'
            css={{
              height: 'auto',
              tableLayout: 'auto',
            }}
          >
            <Table.Header>
              {columns.map((column) => (
                <Table.Column key={column.key}>{column.label}</Table.Column>
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
        </div>
      ) : (
        <Text>No transactions available.</Text>
      )}
    </>
  );
}
