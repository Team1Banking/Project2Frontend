import React, { useEffect, useState, useCallback } from 'react';
import {
  Text,
  Grid,
  Card,
  Spacer,
  Table,
  Modal,
  Button,
} from '@nextui-org/react';
import axios from 'axios';
import Withdraw from './Withdraw';
import Deposit from './Deposit';
import './Profile.css';

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
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [transferAccount, setTransferAccount] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<number>(0);

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

  const openAccountModal = (account: Account) => {
    console.log('openAccountModal is called with account: ', account);
    setSelectedAccount(account);
  };

  useEffect(() => {
    console.log('selectedAccount has changed: ', selectedAccount);
  }, [selectedAccount]);

  const closeAccountModal = () => {
    setSelectedAccount(null);
  };

  const fetchAccounts = useCallback(async () => {
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
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchAccounts();
      fetchTransactions();
    }
  }, [userId, fetchTransactions, fetchAccounts]);

  const updateAccounts = useCallback(async () => {
    await fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const parsedToken = parseJwt(accessToken);
    if (parsedToken && parsedToken.Role === 'Account Holder') {
      setUserId(parsedToken.Id);
    }
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      const updatedAccounts = accounts.map((account) =>
        account.acctId === selectedAccount.acctId ? selectedAccount : account
      );
      setAccounts(updatedAccounts);
    }
  }, [selectedAccount, accounts]);

  return (
    <>
      <Spacer />
      <Grid.Container gap={2} className='flex justify-center w-screen pt-5'>
        <Grid xs={12} md={6}>
          <Card
            className='flex-row justify-evenly '
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
                <Card
                  className='cursor-pointer '
                  isHoverable
                  key={account.acctId}
                  css={{
                    background: 'rgba(255, 255, 255, 0.035)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    borderRadius: '8px',
                    padding: '16px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div
                    className='flex justify-between'
                    onClick={() => openAccountModal(account)}
                  >
                    <div>
                      <Text
                        h2
                        size={20}
                        css={{
                          textGradient: '45deg, $yellow600 -20%, $red600 100%',
                          textAlign: 'center',
                        }}
                        weight='bold'
                      >
                        Account ID: {account.acctId}
                      </Text>
                    </div>
                    <div>
                      <Text
                        h2
                        size={20}
                        css={{
                          textGradient: '45deg, $yellow600 -20%, $red600 100%',
                          textAlign: 'center',
                        }}
                        weight='bold'
                      >
                        {account.acctType}
                      </Text>
                    </div>
                    <div>
                      <Text
                        h2
                        size={20}
                        css={{
                          textGradient: '45deg, $yellow600 -20%, $red600 100%',
                          textAlign: 'center',
                        }}
                        weight='bold'
                      >
                        Balance: {account.accoutValue}
                      </Text>
                    </div>
                  </div>
                </Card>
              ))}
            </Card.Body>
          </Card>
        </Grid>
        <Grid xs={12} md={6}>
          <Card
            className='flex-row justify-evenly'
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
                <Card
                  className='cursor-pointer '
                  key={account.acctId}
                  isHoverable
                  css={{
                    background: 'rgba(255, 255, 255, 0.035)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    borderRadius: '8px',
                    padding: '16px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div
                    className='flex justify-between'
                    onClick={() => openAccountModal(account)}
                  >
                    <div>
                      <Text
                        h2
                        size={20}
                        css={{
                          textGradient: '45deg, $yellow600 -20%, $red600 100%',
                          textAlign: 'center',
                        }}
                        weight='bold'
                      >
                        Account ID: {account.acctId}
                      </Text>
                    </div>
                    <div>
                      <Text
                        h2
                        size={20}
                        css={{
                          textGradient: '45deg, $yellow600 -20%, $red600 100%',
                          textAlign: 'center',
                        }}
                        weight='bold'
                      >
                        {account.acctType}
                      </Text>
                    </div>
                    <div>
                      <Text
                        h2
                        size={20}
                        css={{
                          textGradient: '45deg, $yellow600 -20%, $red600 100%',
                          textAlign: 'center',
                        }}
                        weight='bold'
                      >
                        Balance: {account.accoutValue}
                      </Text>
                    </div>
                  </div>
                </Card>
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

      <Modal
        open={selectedAccount !== null}
        blur
        onClose={closeAccountModal}
        css={{
          maxWidth: '1500vw',
          maxHeight: '90vh',
          width: '1000px',
          height: 'auto',
          background: 'rgba(39, 39, 39, 0.293)',
          backdropFilter: 'blur(10px)',
          borderRadius: '30px',
          padding: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          margin: 'auto',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {selectedAccount && (
          <>
            <Modal.Header>
              <Text h2>Account Details</Text>
            </Modal.Header>
            <Spacer />
            <Modal.Body>
              <div className='flex flex-row items-center justify-evenly '>
                <div className='glass-background'>
                  <Deposit
                    accountId={selectedAccount!.acctId}
                    account={selectedAccount!}
                    onUpdateBalance={(newBalance) => {
                      setSelectedAccount((prevAccount) => {
                        if (prevAccount) {
                          return {
                            ...prevAccount,
                            accoutValue: newBalance,
                          };
                        }
                        return null;
                      });
                      updateAccounts();
                      fetchTransactions();
                    }}
                  />
                </div>
                <Spacer />
                <div className='glass-background'>
                  <Withdraw
                    accountId={selectedAccount!.acctId}
                    account={selectedAccount!}
                    onUpdateBalance={(newBalance) => {
                      setSelectedAccount((prevAccount) => {
                        if (prevAccount) {
                          return {
                            ...prevAccount,
                            accoutValue: newBalance,
                          };
                        }
                        return null;
                      });
                      updateAccounts();
                      fetchTransactions();
                    }}
                  />
                </div>
              </div>
              <Spacer y={3} />
              <div className='flex flex-col '>
                <div className='flex items-center justify-center glass-background'>
                  <h1>Transfer</h1>
                </div>
                <Spacer />

                <div className='flex flex-row justify-center'>
                  <div>
                    <Text
                      h2
                      size={20}
                      css={{
                        textGradient: '45deg, $yellow600 -20%, $red600 100%',
                        textAlign: 'center',
                      }}
                      weight='bold'
                    >
                      Account ID: {selectedAccount.acctId}
                    </Text>
                  </div>
                  <Spacer />
                  <div>
                    <Text
                      h2
                      size={20}
                      css={{
                        textGradient: '45deg, $yellow600 -20%, $red600 100%',
                        textAlign: 'center',
                      }}
                      weight='bold'
                    >
                      {selectedAccount.acctType}
                    </Text>
                  </div>
                  <Spacer />
                  <div>
                    <Text
                      h2
                      size={20}
                      css={{
                        textGradient: '45deg, $yellow600 -20%, $red600 100%',
                        textAlign: 'center',
                      }}
                      weight='bold'
                    >
                      Balance: {selectedAccount.accoutValue}
                    </Text>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button color='success' onClick={closeAccountModal}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
}
