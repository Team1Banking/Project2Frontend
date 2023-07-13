import React, { useEffect, useState, useCallback } from 'react';
import {
  Text,
  Grid,
  Card,
  Spacer,
  Table,
  Modal,
  Button,
  Input,
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
  const [transferAccount, setTransferAccount] = useState<Account | null>(null);
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [transferStatus, setTransferStatus] = useState<
    'success' | 'error' | null
  >(null);

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
      const url = `${process.env.REACT_APP_HOST_API_URL}/user/${userId}/All/Transactions`;
      const accessToken = localStorage.getItem('accessToken');

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const uniqueTransactions = Array.from(
        new Set(
          response.data.map(
            (transaction: Transaction) => transaction.transactionId
          )
        )
      ).map((transactionId) =>
        response.data.find(
          (transaction: Transaction) =>
            transaction.transactionId === transactionId
        )
      );

      setTransactions(uniqueTransactions.slice(0, 5));
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
    setTransferAccount(null);
    setTransferAmount(0);
  };

  const updateAccounts = useCallback(async () => {
    try {
      const url = `${process.env.REACT_APP_HOST_API_URL}/user/${userId}`;
      const accessToken = localStorage.getItem('accessToken');

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
    const accessToken = localStorage.getItem('accessToken');
    const parsedToken = parseJwt(accessToken);
    if (parsedToken && parsedToken.Role === 'Account Holder') {
      setUserId(parsedToken.Id);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      updateAccounts();
      fetchTransactions();
    }
  }, [userId, updateAccounts, fetchTransactions]);

  useEffect(() => {
    if (selectedAccount) {
      const updatedAccounts = accounts.map((account) =>
        account.acctId === selectedAccount.acctId ? selectedAccount : account
      );
      setAccounts(updatedAccounts);
    }
  }, [selectedAccount, accounts]);

  const handleTransfer = async () => {
    try {
      const url = `${process.env.REACT_APP_HOST_API_URL}/account/Transfer`;

      const payload = {
        amount: transferAmount,
        recepientAcct: transferAccount?.acctId,
        senderAcct: selectedAccount?.acctId,
      };

      const accessToken = localStorage.getItem('accessToken');

      const response = await axios.put(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Transfer successful:', response.data);

      setSelectedAccount((prevAccount) => {
        if (prevAccount) {
          return {
            ...prevAccount,
            accoutValue: prevAccount.accoutValue - transferAmount,
          };
        }
        return null;
      });

      if (transferAccount) {
        const updatedTransferAccount = {
          ...transferAccount,
          accoutValue: transferAccount.accoutValue + transferAmount,
        };
        const updatedAccounts = accounts.map((account) =>
          account.acctId === transferAccount.acctId
            ? updatedTransferAccount
            : account
        );
        setAccounts(updatedAccounts);
      }

      setTransferStatus('success');
    } catch (error) {
      console.error('Transfer failed:', error);

      setTransferStatus('error');
    }

    await updateAccounts();
    await fetchTransactions();
  };

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
              background: 'rgba(255, 255, 255, 0.039)',
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
                textGradient: '45deg, $blue800 -20%, $purple800 100%',
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
                    background: 'rgba(255, 255, 255, 0.039)',
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
                          textGradient: '45deg, $blue800 -20%, $purple800 100%',
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
                          textGradient: '45deg, $blue800 -20%, $purple800 100%',
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
                          textGradient: '45deg, $blue800 -20%, $purple800 100%',
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
              background: 'rgba(255, 255, 255, 0.039)',
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
                textGradient: '45deg, $blue800 -20%, $purple800 100%',
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
                    background: 'rgba(255, 255, 255, 0.039)',
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
                          textGradient: '45deg, $blue800 -20%, $purple800 100%',
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
                          textGradient: '45deg, $blue800 -20%, $purple800 100%',
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
                          textGradient: '45deg, $blue800 -20%, $purple800 100%',
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
              background: 'rgba(255, 255, 255, 0.039)',
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
                textGradient: '45deg, $blue800 -20%, $purple800 100%',
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
          background: 'rgba(39, 39, 39, 0.293)',
          backdropFilter: 'blur(10px)',
          borderRadius: '30px',
          padding: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          margin: 'auto',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {selectedAccount && (
          <>
            <Modal.Header>
              <div className='flex flex-row items-center justify-evenly glass-background'>
                <div>
                  <Text
                    h2
                    size={27}
                    css={{
                      textAlign: 'center',
                    }}
                    weight='bold'
                  >
                    Account ID: {selectedAccount.acctId}
                  </Text>
                </div>
                <Spacer x={4} />
                <div>
                  <Text
                    h2
                    size={28}
                    css={{
                      textAlign: 'center',
                    }}
                    weight='bold'
                  >
                    {selectedAccount.acctType}
                  </Text>
                </div>
                <Spacer x={4} />
                <div>
                  <Text
                    h2
                    size={28}
                    css={{
                      textAlign: 'center',
                    }}
                    weight='bold'
                  >
                    Balance: {selectedAccount.accoutValue}
                  </Text>
                </div>
              </div>
            </Modal.Header>
            <Spacer x={7} />
            <Modal.Body>
              <div className='flex flex-col items-center justify-center'>
                <div className='flex flex-col items-start justify-center'>
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
                  <Spacer y={2} />
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

                  <Spacer y={2} />
                  <div className='flex flex-row items-center justify-center '>
                    <Text
                      h1
                      size={28}
                      css={{
                        textGradient: '45deg, $blue800 -20%, $purple800 100%',
                      }}
                      weight='bold'
                    >
                      Transfer Amount:
                    </Text>
                    <Spacer x={2} />
                    <div className='flex flex-row'>
                      <Input
                        type='number'
                        value={transferAmount}
                        onChange={(e) =>
                          setTransferAmount(parseFloat(e.target.value))
                        }
                      />
                      <Spacer />
                      <select
                        className=' glass-background'
                        value={transferAccount?.acctId || ''}
                        onChange={(e) => {
                          const selectedAccountId = parseInt(e.target.value);
                          const selectedAccount = accounts.find(
                            (account) => account.acctId === selectedAccountId
                          );
                          setTransferAccount(selectedAccount || null);
                        }}
                      >
                        <option value=''>Account</option>
                        {accounts.map((account) => (
                          <option key={account.acctId} value={account.acctId}>
                            {account.acctType} (ID: {account.acctId})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <Spacer y={3} />
                <div className='flex flex-col justify-items-start '>
                  <Button
                    color='primary'
                    disabled={
                      !transferAccount ||
                      transferAccount.acctId === selectedAccount?.acctId
                    }
                    onClick={handleTransfer}
                  >
                    Transfer
                  </Button>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              {transferStatus === 'success' && (
                <div className='flex justify-center'>
                  <Text
                    color='success'
                    css={{ textAlign: 'center' }}
                    weight='bold'
                  >
                    Transfer successful!
                  </Text>
                </div>
              )}
              {transferStatus === 'error' && (
                <div className='flex justify-center'>
                  <Text
                    color='error'
                    css={{ textAlign: 'center' }}
                    weight='bold'
                  >
                    Transfer failed. Please try again.
                  </Text>
                </div>
              )}
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
